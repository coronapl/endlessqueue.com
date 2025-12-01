import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/posts" }),
  schema: rssSchema,
});

export const collections = { posts };
