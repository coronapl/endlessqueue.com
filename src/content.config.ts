import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/posts" }),
  schema: z.object({
    type: z.literal("post"),
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
  }),
});

const tils = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/tils" }),
  schema: z.object({
    type: z.literal("til"),
    title: z.string(),
    tags: z.array(z.string()),
    pubDate: z.date(),
  }),
});

export const collections = { posts, tils };
