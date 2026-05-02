import * as cheerio from 'cheerio';

/**
 * Clean HTML by removing scripts, styles, nav, footer, and other noise elements.
 * Used by fetch tool to provide cleaner content.
 */
export function cleanHtml(html: string): string {
	const $ = cheerio.load(html);

	$('script, style, nav, footer, header, aside').remove();

	$(
		"[class*='ad-'], [class*='advertisement'], [id*='ad-'], [id*='sidebar']"
	).remove();

	$.root()
		.contents()
		.filter((_, el) => el.type === 'comment')
		.remove();

	return $.html();
}

/**
 * Strip all HTML tags and return plain text.
 */
export function htmlToText(html: string): string {
	const $ = cheerio.load(html);
	return $.text().trim();
}
