import { afterEach, beforeEach, describe, expect, test, vi } from 'bun:test';
import { searchHandler } from '../../src/tools/search/index.js';

describe('search', () => {
	let originalFetch: typeof globalThis.fetch;

	beforeEach(() => {
		originalFetch = globalThis.fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	describe('searchHandler', () => {
		test('returns results from API source', async () => {
			// Mock API response
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						AbstractURL: 'https://example.com',
						AbstractText: 'Example abstract',
						Heading: 'Example',
						RelatedTopics: [
							{ Text: 'Related Topic 1', FirstURL: 'https://example1.com' },
							{ Text: 'Related Topic 2', FirstURL: 'https://example2.com' },
						],
					}),
			}) as unknown as typeof fetch;

			const result = await searchHandler({ query: 'test', limit: 5 });

			expect(result.query).toBe('test');
			expect(result.source).toBe('api');
			expect(result.results.length).toBeGreaterThan(0);
			expect(result.results[0]).toHaveProperty('title');
			expect(result.results[0]).toHaveProperty('url');
		});

		test('returns results from scraping when API fails', async () => {
			// Mock API failure, scraping success
			globalThis.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: false,
					status: 500,
				})
				.mockResolvedValueOnce({
					ok: true,
					text: () =>
						Promise.resolve(
							`<html><body>
                <a class="result-link" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com">Example Site</a>
              </body></html>`
						),
				}) as unknown as typeof fetch;

			const result = await searchHandler({ query: 'test', limit: 5 });

			expect(result.query).toBe('test');
			expect(result.results.length).toBeGreaterThan(0);
		});

		test('throws error when both sources fail', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			}) as unknown as typeof fetch;

			await expect(searchHandler({ query: 'test' })).rejects.toThrow();
		});

		test('respects limit parameter', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						RelatedTopics: [
							{ Text: 'Topic 1', FirstURL: 'https://example1.com' },
							{ Text: 'Topic 2', FirstURL: 'https://example2.com' },
							{ Text: 'Topic 3', FirstURL: 'https://example3.com' },
						],
					}),
			}) as unknown as typeof fetch;

			const result = await searchHandler({ query: 'test', limit: 2 });

			expect(result.results.length).toBeLessThanOrEqual(2);
		});

		test('handles empty API response with scraping fallback', async () => {
			globalThis.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve({ RelatedTopics: [] }),
				})
				.mockResolvedValueOnce({
					ok: true,
					text: () =>
						Promise.resolve(
							`<html><body>
                <a class="result-link" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Ffallback.com">Fallback Result</a>
              </body></html>`
						),
				}) as unknown as typeof fetch;

			const result = await searchHandler({ query: 'test' });

			expect(result.results.length).toBeGreaterThan(0);
		});

		test('deduplicates results from multiple sources', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						RelatedTopics: [
							{ Text: 'Topic', FirstURL: 'https://same-url.com' },
						],
					}),
			}) as unknown as typeof fetch;

			const result = await searchHandler({ query: 'test', limit: 10 });

			const urls = result.results.map((r) => r.url);
			const uniqueUrls = new Set(urls);
			expect(urls.length).toBe(uniqueUrls.size);
		});

		test('includes snippet when available from API', async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						AbstractURL: 'https://example.com',
						AbstractText: 'This is a snippet',
						Heading: 'Example Title',
						RelatedTopics: [],
					}),
			}) as unknown as typeof fetch;

			const result = await searchHandler({ query: 'test' });

			expect(result.results[0].snippet).toBeDefined();
			expect(result.results[0].snippet).toContain('snippet');
		});
	});
});
