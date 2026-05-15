import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'data',
  schema: z.object({
    title:          z.string(),
    price:          z.number(),
    category:       z.string().optional(),
    featured:       z.boolean().optional(),
    imageUrl:       z.string().optional(),
    amazonUrl:      z.string().optional(),
    amazon_url:     z.string().optional(),
    description:    z.string().optional(),
    description_en: z.string().optional(),
    description_ja: z.string().optional(),
    discount_rate:  z.number().optional(),
    tags:           z.array(z.string()).optional(),
  }),
});

export const collections = { products };
