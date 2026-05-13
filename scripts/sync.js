#!/usr/bin/env node
/**
 * JapanDaily sync engine
 *
 * Flow per keyword:
 *   Amazon PA-API v5 (SearchItems) → raw product data
 *   → Gemini 1.5 Flash             → bilingual article JSON
 *   → src/content/products/<slug>.json
 *   → SNS post (non-fatal)
 *
 * Idempotent: existing slug files are skipped.
 *
 * @module sync
 */

import { createHmac, createHash }                  from 'node:crypto';
import { writeFileSync, existsSync, mkdirSync }     from 'node:fs';
import { join, dirname }                            from 'node:path';
import { fileURLToPath }                            from 'node:url';
import { GoogleGenerativeAI }                       from '@google/generative-ai';
import { postToX, postToFacebook, postToInstagram } from './sns.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../src/content/products');

/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Env validation ────────────────────────────────────────────────────────────

const REQUIRED_ENV = [
  'AMAZON_ACCESS_KEY',
  'AMAZON_SECRET_KEY',
  'AMAZON_PARTNER_TAG',
  'GEMINI_API_KEY',
];

function validateEnv() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

// ── Amazon PA-API v5  (AWS Sig V4) ────────────────────────────────────────────

const PAAPI_HOST   = 'webservices.amazon.co.jp';
const PAAPI_REGION = 'us-east-1';
const PAAPI_SVC    = 'ProductAdvertisingAPI';
const PAAPI_TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';
const PAAPI_URI    = '/paapi5/searchitems';

/**
 * Derives the AWS Signature V4 signing key.
 * @param {string} secret
 * @param {string} datestamp - YYYYMMDD
 * @returns {Buffer}
 */
function buildSigningKey(secret, datestamp) {
  const h = (key, msg) => createHmac('sha256', key).update(msg, 'utf8').digest();
  return h(h(h(h(`AWS4${secret}`, datestamp), PAAPI_REGION), PAAPI_SVC), 'aws4_request');
}

/**
 * Searches Amazon JP for products via PA-API v5.
 * @param {string} keywords
 * @param {string} searchIndex
 * @param {number} itemCount
 * @returns {Promise<Array>}
 */
async function searchAmazonProducts(keywords, searchIndex = 'All', itemCount = 3) {
  const now       = new Date();
  const amzDate   = now.toISOString().replace(/-/g,'').replace(/:/g,'').replace(/\.\d{3}/,'');
  const datestamp = amzDate.slice(0, 8);

  const payload = JSON.stringify({
    Keywords:    keywords,
    SearchIndex: searchIndex,
    ItemCount:   itemCount,
    PartnerTag:  process.env.AMAZON_PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.co.jp',
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'Offers.Listings.Price',
    ],
  });

  const payloadHash = createHash('sha256').update(payload, 'utf8').digest('hex');

  const canonHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=utf-8\n` +
    `host:${PAAPI_HOST}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${PAAPI_TARGET}\n`;

  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

  const canonRequest = [
    'POST', PAAPI_URI, '',
    canonHeaders, signedHeaders, payloadHash,
  ].join('\n');

  const credScope = `${datestamp}/${PAAPI_REGION}/${PAAPI_SVC}/aws4_request`;
  const strToSign = [
    'AWS4-HMAC-SHA256', amzDate, credScope,
    createHash('sha256').update(canonRequest, 'utf8').digest('hex'),
  ].join('\n');

  const signingKey = buildSigningKey(process.env.AMAZON_SECRET_KEY, datestamp);
  const signature  = createHmac('sha256', signingKey).update(strToSign, 'utf8').digest('hex');
  const authHeader =
    `AWS4-HMAC-SHA256 Credential=${process.env.AMAZON_ACCESS_KEY}/${credScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${PAAPI_HOST}${PAAPI_URI}`, {
    method: 'POST',
    headers: {
      'content-encoding': 'amz-1.0',
      'content-type':     'application/json; charset=utf-8',
      host:               PAAPI_HOST,
      'x-amz-date':       amzDate,
      'x-amz-target':     PAAPI_TARGET,
      Authorization:      authHeader,
    },
    body: payload,
  });

  if (!res.ok) {
    throw new Error(`PA-API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.SearchResult?.Items ?? [];
}

// ── Gemini article generation ─────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a bilingual product article via Gemini 1.5 Flash.
 * @param {{ asin: string, title: string, price: string, features: string[] }} product
 * @returns {Promise<{ titleEn: string, titleJa: string, articleEn: string, articleJa: string, category: string }>}
 */
async function generateArticle(product) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a bilingual product journalist for JapanDaily, an English-Japanese lifestyle site.

Product:
- Title: ${product.title}
- ASIN: ${product.asin}
- Price: ${product.price}
- Features: ${product.features.slice(0, 5).join(' | ')}

Respond with ONLY a single valid JSON object (no markdown fences, no preamble):
{
  "titleEn":   "Engaging English headline, max 60 chars",
  "titleJa":   "日本語の見出し（30文字以内）",
  "articleEn": "English review 150-200 words. Cover: what it is, who it is for, key benefits, soft call-to-action.",
  "articleJa": "自然な日本語のレビュー（200字以上）。商品概要・対象ユーザー・主なメリット・購入を促す一文を含める。",
  "category":  "Exactly one of: Electronics | Fashion | Home | Beauty | Food | Sports | Books | Toys"
}`;

  const result = await model.generateContent(prompt);
  const raw    = result.response.text().trim()
                   .replace(/^```(?:json)?\n?/, '')
                   .replace(/\n?```$/, '')
                   .trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Gemini parse error: ${err.message} | raw: ${raw.slice(0, 300)}`);
  }
}

// ── File helpers ──────────────────────────────────────────────────────────────

/**
 * Converts a product title + ASIN to a URL-safe slug.
 * @param {string} title
 * @param {string} asin
 * @returns {string}
 */
function toSlug(title, asin) {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) +
    '-' + asin.toLowerCase()
  );
}

// ── Search targets ────────────────────────────────────────────────────────────

const SEARCH_TARGETS = [
  { keywords: '日本 ガジェット おすすめ',    index: 'Electronics'    },
  { keywords: '和風 インテリア おしゃれ',    index: 'HomeAndKitchen' },
  { keywords: '日本製 スキンケア 人気',      index: 'Beauty'         },
  { keywords: '和菓子 ギフト 人気',         index: 'Grocery'        },
  { keywords: '日本 アウトドア グッズ 2024', index: 'SportingGoods'  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  validateEnv();
  mkdirSync(CONTENT_DIR, { recursive: true });

  const startedAt   = new Date().toISOString();
  let   newArticles = 0;
  console.log(`[sync] Started at ${startedAt}`);

  for (const { keywords, index } of SEARCH_TARGETS) {
    try {
      console.log(`\n[sync] Searching: "${keywords}" [${index}]`);
      const items = await searchAmazonProducts(keywords, index, 3);
      console.log(`[sync] Found ${items.length} item(s)`);

      for (const item of items) {
        const asin     = item.ASIN;
        const rawTitle = item.ItemInfo?.Title?.DisplayValue ?? asin;
        const slug     = toSlug(rawTitle, asin);
        const outPath  = join(CONTENT_DIR, `${slug}.json`);

        if (existsSync(outPath)) {
          console.log(`[sync] Skip (exists): ${asin}`);
          continue;
        }

        const raw = {
          asin,
          title:        rawTitle,
          price:        item.Offers?.Listings?.[0]?.Price?.DisplayAmount ?? '価格未定',
          imageUrl:     item.Images?.Primary?.Large?.URL ?? '',
          affiliateUrl: `https://www.amazon.co.jp/dp/${asin}?tag=${process.env.AMAZON_PARTNER_TAG}`,
          features:     item.ItemInfo?.Features?.DisplayValues ?? [],
        };

        let article;
        try {
          console.log(`[sync] Generating article for ${asin}...`);
          article = await generateArticle(raw);
        } catch (geminiErr) {
          console.error(`[sync] Gemini failed for ${asin}:`, geminiErr.message);
          article = {
            titleEn:   raw.title,
            titleJa:   raw.title,
            articleEn: raw.features.join(' '),
            articleJa: raw.features.join(' '),
            category:  'General',
          };
        }

        const record = {
          asin,
          slug,
          title:        article.titleEn,
          titleJa:      article.titleJa,
          price:        raw.price,
          imageUrl:     raw.imageUrl,
          affiliateUrl: raw.affiliateUrl,
          category:     article.category,
          articleEn:    article.articleEn,
          articleJa:    article.articleJa,
          generatedAt:  new Date().toISOString(),
        };

        writeFileSync(outPath, JSON.stringify(record, null, 2), 'utf8');
        console.log(`[sync] Saved: ${slug}.json`);
        newArticles++;

        // SNS posts (non-critical — errors are swallowed)
        try {
          await postToX(
            `🗾 ${article.titleEn}\n${raw.price}\n\n${raw.affiliateUrl}\n\n#JapanDaily #Japan`
          );
          await postToFacebook(article.articleEn, raw.affiliateUrl);
          if (raw.imageUrl) {
            await postToInstagram(
              `${article.titleJa}\n\n${article.articleJa}\n\n#JapanDaily #日本デイリー`,
              raw.imageUrl
            );
          }
        } catch (snsErr) {
          console.warn(`[sync] SNS skipped for ${asin}:`, snsErr.message);
        }

        // PA-API rate limit: 1 req/s
        await sleep(1100);
      }
    } catch (err) {
      console.error(`[sync] Failed block "${keywords}":`, err.message);
    }

    await sleep(1500);
  }

  console.log(`\n[sync] Done. New articles: ${newArticles}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('[sync] Fatal:', err);
  process.exit(1);
});
