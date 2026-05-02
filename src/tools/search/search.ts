import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol";
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types";
import type { SearchInput } from "../../schemas/search.js";
import type { SearchResult } from "../../types/search.js";
import { searchWithAPI } from "./api.js";
import { searchWithScraping } from "./scraping.js";

function mergeResults(...allResults: SearchResult[][]): SearchResult[] {
  const seen = new Set<string>();
  const merged: SearchResult[] = [];

  for (const results of allResults) {
    for (const result of results) {
      const key = result.url.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(result);
      }
    }
  }

  return merged;
}

export async function performSearch(args: unknown) {
  const { query, limit = 10 } = args as SearchInput;

  const [apiResults, scrapingResults] = await Promise.allSettled([
    searchWithAPI(query, limit),
    searchWithScraping(query, limit),
  ]);

  const successfulResults: SearchResult[][] = [];

  if (apiResults.status === "fulfilled" && apiResults.value.length > 0) {
    successfulResults.push(apiResults.value);
  }

  if (scrapingResults.status === "fulfilled" && scrapingResults.value.length > 0) {
    successfulResults.push(scrapingResults.value);
  }

  if (successfulResults.length === 0) {
    throw new Error(`Search failed: both API and scraping returned no results`);
  }

  const mergedResults = mergeResults(...successfulResults).slice(0, limit);
  const sources = successfulResults.map((_, i) => (i === 0 ? "api" : "scraping"));

  return {
    query,
    source: sources.length > 1 ? "hybrid" : sources[0] || "api",
    results: mergedResults,
  };
}

export function createSearchHandler() {
  return async (
    args: SearchInput,
    _extra: RequestHandlerExtra<ServerRequest, ServerNotification>
  ): Promise<CallToolResult> => {
    try {
      const { query, limit = 10 } = args;
      const result = await performSearch({ query, limit });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
        isError: true,
      };
    }
  };
}
