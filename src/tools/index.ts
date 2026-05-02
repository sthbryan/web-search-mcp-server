import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchInputSchema } from "../schemas/fetch.js";
import { queryInputSchema } from "../schemas/query.js";
import { searchInputSchema } from "../schemas/search.js";
import { createFetchHandler } from "./fetch/index.js";
import { createQueryHandler } from "./query/index.js";
import { createSearchHandler } from "./search/search.js";

export function registerTools(server: McpServer): void {
  server.registerTool(
    "fetch_page",
    {
      title: "Fetch Page",
      description: "Fetch web content from a URL in various formats (html, markdown, text).",
      inputSchema: fetchInputSchema,
    },
    createFetchHandler()
  );

  server.registerTool(
    "search",
    {
      title: "Search",
      description: "Search the web and return results with URLs and snippets.",
      inputSchema: searchInputSchema,
    },
    createSearchHandler()
  );

  server.registerTool(
    "query",
    {
      title: "Query",
      description: "Get specific data from a webpage using CSS selectors or text search.",
      inputSchema: queryInputSchema,
    },
    createQueryHandler()
  );
}
