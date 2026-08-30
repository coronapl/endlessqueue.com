import type { CollectionEntry } from "astro:content";

export function sortPosts<
  T extends CollectionEntry<"posts"> | CollectionEntry<"tils">,
>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
      a.id.localeCompare(b.id),
  );
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getExcerpt(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, "") // fenced code blocks
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/[*_`~]/g, "") // emphasis/code markers
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 200);
}
