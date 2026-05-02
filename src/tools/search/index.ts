import { SearchSchema } from "../../schemas/search.js";
import type { SearchResponse, SearchResult } from "../../types/search.js";
import { searchWithAPI } from "./api.js";
import { searchWithScraping } from "./scraping.js";

/**
 * Merge and deduplicate results from multiple sources.
 */
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

/**
 * Search handler that combines API and scraping results for better coverage.
 * Both sources run in parallel; results are merged and deduplicated.
 */
export async function searchHandler(args: unknown): Promise<SearchResponse> {
  const { query, limit } = SearchSchema.parse(args);

  const [apiResults, scrapingResults] = await Promise.allSettled([
    searchWithAPI(query, limit),
    searchWithScraping(query, limit),
  ]);

  const successfulResults: SearchResult[][] = [];

  if (apiResults.status === "fulfilled" && apiResults.value.length > 0) {
    successfulResults.push(apiResults.value);
    console.log(`API search returned ${apiResults.value.length} results`);
  } else {
    console.error(
      "API search failed:",
      apiResults.status === "rejected" ? apiResults.reason : "no results"
    );
  }

  if (scrapingResults.status === "fulfilled" && scrapingResults.value.length > 0) {
    successfulResults.push(scrapingResults.value);
    console.log(`Scraping search returned ${scrapingResults.value.length} results`);
  } else {
    console.error(
      "Scraping search failed:",
      scrapingResults.status === "rejected" ? scrapingResults.reason : "no results"
    );
  }

  if (successfulResults.length === 0) {
    throw new Error(`Search failed: both API and scraping returned no results`);
  }

  const mergedResults = mergeResults(...successfulResults).slice(0, limit);

  const sources = successfulResults.map((_, i) => (i === 0 ? "api" : ("scraping" as const)));

  return {
    query,
    source: sources.length > 1 ? "hybrid" : sources[0] || "api",
    results: mergedResults,
  };
}
