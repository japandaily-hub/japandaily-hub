/**
 * JapanDaily SNS posting utilities
 * X (Twitter) v2 API and Meta Graph API (Facebook + Instagram).
 *
 * Missing credentials → logs a warning and returns null (non-fatal).
 * @module sns
 */

import { TwitterApi } from 'twitter-api-v2';

// ── X (Twitter) v2 ───────────────────────────────────────────────────────────

const xClient = (() => {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    console.warn('[sns] X credentials not configured — X posting disabled');
    return null;
  }
  return new TwitterApi({
    appKey:      X_API_KEY,
    appSecret:   X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret:X_ACCESS_SECRET,
  }).readWrite.v2;
})();

/**
 * Posts a tweet to X.
 * @param {string} text - Hard-truncated to 280 chars
 * @returns {Promise<string|null>} Tweet ID or null
 */
export async function postToX(text) {
  if (!xClient) return null;
  const safe = text.length > 280 ? text.slice(0, 277) + '...' : text;
  const { data } = await xClient.tweet(safe);
  console.log(`[sns] X posted: https://x.com/i/web/status/${data.id}`);
  return data.id;
}

// ── Meta Graph API ────────────────────────────────────────────────────────────

const META_BASE = 'https://graph.facebook.com/v19.0';

/**
 * Posts to a Facebook Page.
 * @param {string} message
 * @param {string} [link]
 * @returns {Promise<string|null>} Post ID or null
 */
export async function postToFacebook(message, link = null) {
  const { META_ACCESS_TOKEN, META_PAGE_ID } = process.env;
  if (!META_ACCESS_TOKEN || !META_PAGE_ID) {
    console.warn('[sns] Meta credentials not configured — Facebook posting disabled');
    return null;
  }

  const res = await fetch(`${META_BASE}/${META_PAGE_ID}/feed`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      message,
      access_token: META_ACCESS_TOKEN,
      ...(link ? { link } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Facebook API ${res.status}: ${JSON.stringify(await res.json())}`);
  }

  const { id } = await res.json();
  console.log(`[sns] Facebook posted: ${id}`);
  return id;
}

/**
 * Posts an image to Instagram via Meta Graph API.
 * Requires an Instagram Business account linked to a Facebook Page.
 * Flow: create container → publish container
 *
 * @param {string} caption
 * @param {string} imageUrl - Must be a publicly reachable URL
 * @returns {Promise<string|null>} Post ID or null
 */
export async function postToInstagram(caption, imageUrl) {
  const { META_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } = process.env;
  if (!META_ACCESS_TOKEN || !INSTAGRAM_ACCOUNT_ID) {
    console.warn('[sns] Instagram credentials not configured — Instagram posting disabled');
    return null;
  }

  // Step 1: Create media container
  const containerRes = await fetch(`${META_BASE}/${INSTAGRAM_ACCOUNT_ID}/media`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      image_url:    imageUrl,
      caption,
      access_token: META_ACCESS_TOKEN,
    }),
  });

  if (!containerRes.ok) {
    throw new Error(`Instagram container ${containerRes.status}: ${JSON.stringify(await containerRes.json())}`);
  }

  const { id: creationId } = await containerRes.json();

  // Step 2: Publish
  const publishRes = await fetch(`${META_BASE}/${INSTAGRAM_ACCOUNT_ID}/media_publish`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      creation_id:  creationId,
      access_token: META_ACCESS_TOKEN,
    }),
  });

  if (!publishRes.ok) {
    throw new Error(`Instagram publish ${publishRes.status}: ${JSON.stringify(await publishRes.json())}`);
  }

  const { id } = await publishRes.json();
  console.log(`[sns] Instagram posted: ${id}`);
  return id;
}
