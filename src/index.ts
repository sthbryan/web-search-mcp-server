import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { fetchHandler } from "./tools/fetch/index.js";
import { queryHandler } from "./tools/query/index.js";
import { searchHandler } from "./tools/search/index.js";

const server = new Server(
  {
    name: "web-search-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search",
        description:
          "Search the web using DuckDuckGo. Tries API first, falls back to HTML scraping.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            limit: {
              type: "number",
              description: "Maximum number of results (default: 10, max: 50)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "fetch_page",
        description: "Fetch a web page and convert to HTML, markdown, or plain text.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to fetch",
            },
            type: {
              type: "string",
              enum: ["html", "markdown", "text"],
              description: "Output format (default: markdown)",
              default: "markdown",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "query",
        description: "Query specific elements from a web page using CSS selectors.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to query",
            },
            selector: {
              type: "string",
              description: "CSS selector to match elements",
            },
            text: {
              type: "string",
              description: "Text to search for within matched elements (fuzzy match)",
            },
          },
          required: ["url"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case "search":
        result = await searchHandler(args);
        break;
      case "fetch_page":
        result = await fetchHandler(args);
        break;
      case "query":
        result = await queryHandler(args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: String(error) }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Web Search MCP Server started");
}

main().catch(console.error);
