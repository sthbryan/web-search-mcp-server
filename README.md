# Web Search MCP Server

A lightweight MCP (Model Context Protocol) server for web search and scraping. No headless browser or complex dependencies required.

## Tools

### search
Search the web using DuckDuckGo. Tries API first, falls back to HTML scraping if needed.

```json
{
  "name": "search",
  "arguments": {
    "query": "javascript frameworks 2024",
    "limit": 10
  }
}
```

**Response:**
```json
{
  "query": "javascript frameworks 2024",
  "source": "api",
  "results": [
    { "title": "React", "url": "https://react.dev", "snippet": "A JavaScript library..." }
  ]
}
```

### fetch_page
Fetch a web page and convert to HTML, markdown, or plain text.

```json
{
  "name": "fetch_page",
  "arguments": {
    "url": "https://example.com",
    "type": "markdown"
  }
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "type": "markdown",
  "source": "native",
  "length": 1234,
  "content": "# Example\n\nContent here..."
}
```

### query
Query specific elements from a page using CSS selectors.

```json
{
  "name": "query",
  "arguments": {
    "url": "https://news.ycombinator.com",
    "selector": ".title",
    "text": "tech"
  }
}
```

**Response:**
```json
{
  "url": "https://news.ycombinator.com",
  "source": "native",
  "selector": ".title",
  "text": "tech",
  "result": ["Tech News", "Technology Trends"]
}
```

## Installation

```bash
# Clone and install dependencies
bun install

# Build for production
bun run build

# Run directly (development)
bun run start

# Or install globally
bun add -g web-search-mcp-server
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "web-search": {
      "command": "bun",
      "args": ["/path/to/web-search-mcp-server/dist/index.js"]
    }
  }
}
```

## Architecture

```
src/
├── index.ts           # MCP server entry point
├── tools/
│   ├── search/        # search tool (API + scraping)
│   ├── fetch/         # fetch_page tool
│   └── query/         # query tool
├── schemas/           # Zod input validation
├── types/             # TypeScript interfaces
└── utils/
    └── clean.ts       # HTML cleaning utilities
```

## Development

```bash
bun run dev      # Watch mode
bun run build   # Build to dist/
bun test        # Run tests
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol
- `cheerio` - HTML parsing
- `turndown` - HTML to Markdown
- `fuse.js` - Fuzzy text matching
- `zod` - Schema validation

## License

MIT