import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortPosts } from "../utils";
import { baseTitle, baseDescription } from "../constants";
const parser = new MarkdownIt();

export async function GET(context) {
  const posts = sortPosts(await getCollection("posts"));

  return rss({
    title: baseTitle,
    description: baseDescription,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body)),
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
