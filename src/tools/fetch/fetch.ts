import TurndownService from "turndown";
import { fetchInputSchema } from "../../schemas/fetch.js";
import type { FetchResponse } from "../../types/fetch.js";
import { cleanHtml, htmlToText } from "../../utils/clean.js";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

/**
 * Fetch a URL and convert to the specified format.
 */
export async function fetchPage(
  url: string,
  type: "html" | "markdown" | "text" = "markdown"
): Promise<FetchResponse> {
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

  let content: string;
  switch (type) {
    case "html":
      content = cleaned;
      break;
    case "markdown":
      content = turndown.turndown(cleaned);
      break;
    case "text":
      content = htmlToText(cleaned);
      break;
  }

  return {
    url,
    type,
    source: "native",
    length: content.length,
    content,
  };
}

/**
 * Handler for fetch_page tool.
 */
export async function fetchHandler(args: unknown): Promise<FetchResponse> {
  const { url, type } = fetchInputSchema.parse(args);
  return fetchPage(url, type);
}
