import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortPosts, getExcerpt } from "../utils";
import { baseTitle, baseDescription } from "../constants";
const parser = new MarkdownIt();

export async function GET(context) {
  const tils = sortPosts(await getCollection("tils"));

  return rss({
    title: baseTitle,
    description: baseDescription,
    site: context.site,
    items: tils.map((til) => ({
      title: til.data.title,
      pubDate: til.data.pubDate,
      description: getExcerpt(til.body ?? ""),
      content: sanitizeHtml(parser.render(til.body)),
      link: `/tils/${til.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
