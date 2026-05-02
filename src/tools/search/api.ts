import type { SearchResult } from '../../types/search.js';

const DUCKDUCKGO_API = 'https://api.duckduckgo.com/';

interface DuckDuckGoResponse {
	AbstractURL?: string;
	AbstractText?: string;
	Heading?: string;
	Results?: Array<{ Text: string; FirstURL: string }>;
	RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
}

/**
 * Search using DuckDuckGo Instant Answer API.
 * Returns up to `limit` results.
 */
export async function searchWithAPI(
	query: string,
	limit: number
): Promise<SearchResult[]> {
	const url = new URL(DUCKDUCKGO_API);
	url.searchParams.set('q', query);
	url.searchParams.set('format', 'json');
	url.searchParams.set('no_redirect', '1');
	url.searchParams.set('no_html', '1');

	const response = await fetch(url.toString(), {
		headers: {
			'User-Agent': 'web-search-mcp-server/0.1.0',
		},
	});

	if (!response.ok) {
		throw new Error(`DuckDuckGo API failed: ${response.status}`);
	}

	const data: DuckDuckGoResponse = await response.json();

	const results: SearchResult[] = [];

	// Add main result if available
	if (data.AbstractURL) {
		results.push({
			title: data.Heading || query,
			url: data.AbstractURL,
			snippet: data.AbstractText,
		});
	}

	// Add related topics
	if (data.RelatedTopics) {
		for (const topic of data.RelatedTopics) {
			if (topic.Text && topic.FirstURL && results.length < limit) {
				results.push({
					title: topic.Text.substring(0, 100),
					url: topic.FirstURL,
				});
			}
		}
	}

	return results.slice(0, limit);
}
