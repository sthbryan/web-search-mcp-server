export interface SearchResult {
	title: string;
	url: string;
	snippet?: string;
}

export interface SearchResponse {
	query: string;
	source: 'api' | 'scraping' | 'hybrid';
	results: SearchResult[];
}
