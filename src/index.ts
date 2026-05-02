#!/usr/bin/env -S bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";

const server = new McpServer({
  name: "web-search-mcp-server",
  version: "0.2.2",
});

registerTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Web Search MCP Server started");
