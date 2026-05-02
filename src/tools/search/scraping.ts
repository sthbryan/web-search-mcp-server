import * as cheerio from 'cheerio';
import type { SearchResult } from '../../types/search.js';

const DUCKDUCKGO_LITE = 'https://lite.duckduckgo.com/50x/';

/**
 * Search using DuckDuckGo Lite HTML scraping as fallback.
 */
export async function searchWithScraping(
	query: string,
	limit: number
): Promise<SearchResult[]> {
	const url = `${DUCKDUCKGO_LITE}?q=${encodeURIComponent(query)}`;

	const response = await fetch(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; web-search-mcp-server/0.1.0)',
		},
	});

	if (!response.ok) {
		throw new Error(`DuckDuckGo scraping failed: ${response.status}`);
	}

	const html = await response.text();
	const $ = cheerio.load(html);

	const results: SearchResult[] = [];

	// DuckDuckGo Lite uses result class for links
	$(".result a[href^='http']").each((_, el) => {
		if (results.length >= limit) return false;

		const $el = $(el);
		const href = $el.attr('href');
		const text = $el.text().trim();

		if (href && text && !href.includes('duckduckgo.com')) {
			results.push({
				title: text,
				url: href,
			});
		}

		return true;
	});

	return results;
}
