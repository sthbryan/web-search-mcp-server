import * as cheerio from 'cheerio';
import { DUCKDUCKGO_LITE } from '../../config/endpoints.js';
import type { SearchResult } from '../../types/search.js';

/**
 * Search using DuckDuckGo Lite HTML scraping.
 */
export async function searchWithScraping(
	query: string,
	limit: number
): Promise<SearchResult[]> {
	const url = `${DUCKDUCKGO_LITE}?q=${encodeURIComponent(query)}`;

	const response = await fetch(url, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	});

	if (!response.ok) {
		throw new Error(`DuckDuckGo scraping failed: ${response.status}`);
	}

	const html = await response.text();
	const $ = cheerio.load(html);

	const results: SearchResult[] = [];

	$('.result-link').each((_, el) => {
		if (results.length >= limit) return;

		const href = $(el).attr('href') || '';
		const title = $(el).text().trim();

		const match = href.match(/uddg=([^&]+)/);
		if (match) {
			const decodedUrl = decodeURIComponent(match[1]);
			if (title && decodedUrl.startsWith('http')) {
				results.push({ title, url: decodedUrl });
			}
		}
	});

	if (results.length === 0) {
		$('a[href*="uddg="]').each((_, el) => {
			if (results.length >= limit) return;

			const href = $(el).attr('href') || '';
			const title = $(el).text().trim();

			const match = href.match(/uddg=([^&]+)/);
			if (match) {
				const decodedUrl = decodeURIComponent(match[1]);
				if (title && decodedUrl.startsWith('http')) {
					results.push({ title, url: decodedUrl });
				}
			}
		});
	}

	if (results.length === 0) {
		$('a[href^="http"]').each((_, el) => {
			if (results.length >= limit) return;

			const href = $(el).attr('href') || '';
			const title = $(el).text().trim();

			if (href && !href.includes('duckduckgo.com') && title) {
				results.push({ title, url: href });
			}
		});
	}

	if (results.length === 0) {
		throw new Error('no results');
	}

	return results;
}
