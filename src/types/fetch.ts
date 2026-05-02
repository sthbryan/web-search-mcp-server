export interface FetchResponse {
	url: string;
	type: 'html' | 'markdown' | 'text';
	source: 'native';
	length: number;
	content: string;
}
