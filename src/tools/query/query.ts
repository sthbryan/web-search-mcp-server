import * as cheerio from "cheerio";
import Fuse from "fuse.js";
import { QuerySchema } from "../../schemas/query.js";
import type { QueryResponse } from "../../types/query.js";
import { cleanHtml } from "../../utils/clean.js";

/**
 * Query a page using CSS selector and optional text search.
 */
export async function queryPage(
  url: string,
  selector?: string,
  text?: string
): Promise<QueryResponse> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; web-search-mcp-server/0.1.0; +https://github.com/web-search-mcp)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const cleaned = cleanHtml(html);
  const $ = cheerio.load(cleaned);

  let result: string[];

  if (selector) {
    const elements: string[] = [];
    $(selector).each((_, el) => {
      const content = $(el).text().trim();
      if (content) {
        elements.push(content);
      }
    });
    result = elements;
  } else {
    result = [$("body").text().trim()];
  }

  if (text && result.length > 0) {
    const fuse = new Fuse(result, {
      threshold: 0.4,
      includeScore: true,
    });
    const matches = fuse.search(text);
    result = matches.map((m) => m.item);
  }

  return {
    url,
    source: "native",
    selector: selector || null,
    text: text || null,
    result,
  };
}

/**
 * Handler for query tool.
 */
export async function queryHandler(args: unknown): Promise<QueryResponse> {
  const { url, selector, text } = QuerySchema.parse(args);
  return queryPage(url, selector, text);
}
