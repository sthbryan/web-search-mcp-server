import { SearchSchema } from '../../schemas/search.js';
import type { SearchResponse } from '../../types/search.js';
import { searchWithAPI } from './api.js';
import { searchWithScraping } from './scraping.js';

/**
 * Search handler with API fallback to scraping.
 */
export async function searchHandler(args: unknown): Promise<SearchResponse> {
	const { query, limit } = SearchSchema.parse(args);

	try {
		const results = await searchWithAPI(query, limit);
		if (results.length > 0) {
			return { query, source: 'api', results };
		}
	} catch (apiError) {
		console.error('API search failed:', apiError);
	}

	try {
		const results = await searchWithScraping(query, limit);
		return { query, source: 'scraping', results };
	} catch (scrapingError) {
		console.error('Scraping search failed:', scrapingError);
		throw new Error(
			`Search failed: API unavailable and scraping failed: ${scrapingError}`
		);
	}
}
