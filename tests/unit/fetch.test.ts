import { afterEach, beforeEach, describe, expect, test, vi } from "bun:test";
import { fetchHandler, fetchPage } from "../../src/tools/fetch/fetch.js";

describe("fetch", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("fetchPage", () => {
    test("returns markdown content by default", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(`
          <html>
            <head><title>Test Page</title></head>
            <body>
              <h1>Hello World</h1>
              <p>This is a paragraph with content.</p>
            </body>
          </html>
        `),
      }) as unknown as typeof fetch;

      const result = await fetchPage("https://example.com");

      expect(result.url).toBe("https://example.com");
      expect(result.type).toBe("markdown");
      expect(result.source).toBe("native");
      expect(result.content).toContain("Hello World");
      expect(result.length).toBeGreaterThan(0);
    });

    test("returns HTML when type is html", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<html><body><h1>Title</h1></body></html>"),
      }) as unknown as typeof fetch;

      const result = await fetchPage("https://example.com", "html");

      expect(result.type).toBe("html");
      expect(result.content).toContain("<h1>");
    });

    test("returns plain text when type is text", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<html><body><h1>Title</h1><p>Content</p></body></html>"),
      }) as unknown as typeof fetch;

      const result = await fetchPage("https://example.com", "text");

      expect(result.type).toBe("text");
      expect(result.content).toBe("TitleContent");
    });

    test("throws error on HTTP failure", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }) as unknown as typeof fetch;

      await expect(fetchPage("https://example.com")).rejects.toThrow("404");
    });

    test("throws error on network failure", async () => {
      globalThis.fetch = vi
        .fn()
        .mockRejectedValue(new Error("Network error")) as unknown as typeof fetch;

      await expect(fetchPage("https://example.com")).rejects.toThrow("Network error");
    });

    test("includes length in response", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<p>Short content</p>"),
      }) as unknown as typeof fetch;

      const result = await fetchPage("https://example.com");

      expect(result.length).toBe(result.content.length);
    });
  });

  describe("fetchHandler", () => {
    test("parses url and type from args", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<p>Test</p>"),
      }) as unknown as typeof fetch;

      const result = await fetchHandler({
        url: "https://test.com",
        type: "html",
      });

      expect(result.url).toBe("https://test.com");
      expect(result.type).toBe("html");
    });

    test("defaults to markdown type", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("<p>Test</p>"),
      }) as unknown as typeof fetch;

      const result = await fetchHandler({ url: "https://test.com" });

      expect(result.type).toBe("markdown");
    });

    test("throws on invalid url", async () => {
      await expect(fetchHandler({ url: 123 as unknown as string })).rejects.toThrow();
    });
  });
});
