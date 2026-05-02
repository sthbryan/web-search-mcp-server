import { describe, expect, test } from 'bun:test';
import { cleanHtml, htmlToText } from '../../src/utils/clean.js';

const sampleHtml = `
<!DOCTYPE html>
<html>
<head><script>console.log('evil')</script><style>body{color:red}</style></head>
<body>
  <nav>Navigation</nav>
  <h1>Hello World</h1>
  <p>Some content here</p>
  <footer>Footer content</footer>
</body>
</html>
`;

describe('clean.ts', () => {
	test('removes script tags', () => {
		const result = cleanHtml('<script>evil</script><p>content</p>');
		expect(result).not.toContain('script');
	});

	test('removes style tags', () => {
		const result = cleanHtml('<style>.red{color:red}</style><p>content</p>');
		expect(result).not.toContain('style');
	});

	test('removes nav tags', () => {
		const result = cleanHtml('<nav>nav content</nav><p>content</p>');
		expect(result).not.toContain('<nav>');
	});

	test('removes footer tags', () => {
		const result = cleanHtml(sampleHtml);
		expect(result).not.toContain('<footer>');
	});

	test('preserves body content', () => {
		const result = cleanHtml(sampleHtml);
		expect(result).toContain('Hello World');
		expect(result).toContain('Some content here');
	});

	test('htmlToText extracts text', () => {
		const result = htmlToText('<h1>Title</h1><p>Paragraph</p>');
		expect(result).toBe('TitleParagraph');
	});
});
