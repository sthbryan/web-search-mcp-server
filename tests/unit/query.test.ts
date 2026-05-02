import { afterEach, beforeEach, describe, expect, test, vi } from "bun:test";
import { queryHandler, queryPage } from "../../src/tools/query/query.js";

describe("query", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const mockHtml = `
		<html>
			<body>
				<h1>Page Title</h1>
				<h2>Introduction to MCP</h2>
				<p class="intro">MCP is a protocol for AI agents.</p>
				<p class="intro">It enables tool integration.</p>
				<ul>
					<li>MCP Feature One</li>
					<li>MCP Feature Two</li>
					<li>Regular Feature</li>
				</ul>
				<div class="content">
					<h2>Getting Started</h2>
					<p>This section explains how to get started.</p>
				</div>
			</body>
		</html>
	`;

  describe("queryPage", () => {
    test("extracts elements by CSS selector", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", "h1");

      expect(result.url).toBe("https://example.com");
      expect(result.selector).toBe("h1");
      expect(result.result).toContain("Page Title");
    });

    test("filters elements by text when provided", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", "p", "protocol");

      expect(result.text).toBe("protocol");
      expect(result.result.length).toBeGreaterThan(0);
      expect(result.result[0]).toContain("MCP");
    });

    test("returns empty array when no matches", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", ".nonexistent");

      expect(result.result).toEqual([]);
    });

    test("handles multiple selectors", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", "h1, h2");

      expect(result.result.length).toBe(3); // h1 + 2x h2
    });

    test("throws error on HTTP failure", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }) as unknown as typeof fetch;

      await expect(queryPage("https://example.com", "h1")).rejects.toThrow();
    });

    test("works without text filter", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", "li");

      expect(result.result.length).toBe(3);
      expect(result.result).toContain("MCP Feature One");
    });
  });

  describe("queryHandler", () => {
    test("parses url, selector, and text from args", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryHandler({
        url: "https://test.com",
        selector: "h1",
        text: "Title",
      });

      expect(result.url).toBe("https://test.com");
      expect(result.selector).toBe("h1");
      expect(result.text).toBe("Title");
    });

    test("works with only url and selector", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryHandler({
        url: "https://test.com",
        selector: "p",
      });

      expect(result.result.length).toBe(3);
    });

    test("throws on invalid url", async () => {
      await expect(
        queryHandler({ url: "" as unknown as string, selector: "h1" })
      ).rejects.toThrow();
    });

    test("throws on missing selector", async () => {
      await expect(
        queryHandler({ url: "https://test.com" } as unknown as {
          url: string;
          selector: string;
        })
      ).rejects.toThrow();
    });
  });

  describe("fuzzy text matching", () => {
    test("matches partial text", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", "li", "MCP");

      expect(result.result.length).toBe(2);
      expect(result.result).toContain("MCP Feature One");
    });

    test("returns all elements when text is not provided", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      }) as unknown as typeof fetch;

      const result = await queryPage("https://example.com", "p");

      expect(result.result.length).toBe(3); // all p elements
    });
  });
});
