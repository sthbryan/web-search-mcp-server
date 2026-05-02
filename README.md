# Web Search MCP Server

> A Model Context Protocol server for web search and scraping using DuckDuckGo

## Overview

This MCP server provides tools for AI agents to search the web, fetch page content, and query specific elements from pages. It uses **DuckDuckGo** as the primary search engine with a hybrid approach:

- **API search** for fast, direct results
- **HTML scraping** as fallback when API is unavailable
- **Native fetch** for page retrieval and element queries

No headless browser or complex dependencies required.

## Tools

### `search` — Search DuckDuckGo

```json
{ "query": "rust programming", "limit": 5 }```
```

**Response:**
```json
{
  "query": "rust programming language",
  "source": "api",
  "results": [
    { "title": "The Rust Programming Language", "url": "https://rust-lang.org" }
  ]
}
```

### `fetch_page` — Get page content (HTML/markdown/text)

```json
{ "url": "https://example.com", "type": "markdown" }
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

### `query` — Extract elements via CSS selector + text filter

```json
{
    "url": "https://example.com",
    "selector": "h1, h2",
    "text": "intro"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "source": "native",
  "selector": "h1, h2",
  "text": "intro",
  "result": ["Introduction", "Getting Started"]
}
```

## Requirements

- Node.js 18+ or Bun
- Internet connection (for DuckDuckGo API/scraping)

## Installation

```bash
# Clone and install dependencies
bun install

# Build for production
bun run build
```

Add to your MCP servers config:

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

> For client-specific configuration, see [INSTALL.md](./INSTALL.md).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MCP Client                           │
│                       Coding Agent                          │
└─────────────────────────┬───────────────────────────────────┘
                          │ JSON-RPC
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Web Search MCP Server                     │
│        ┌─────────┐   ┌─────────┐   ┌─────────┐              │
│        │  search │   │  fetch  │   │  query  │  ← Tools     │
│        └───┬─────┘   └───┬─────┘   └───┬─────┘              │
│            │             │             │                    │
│            ▼             ▼             ▼                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    searchHandler()                      ││
│  │              (parallel API + scraping)                  ││
│  └──────────────────────────┬──────────────────────────────┘│
│                             │                               │
│                ┌────────────┴────────────┐                  │
│                ▼                         ▼                  │
│         ┌────────────┐           ┌────────────┐             │
│         │ DuckDuckGo │           │   Native   │             │
│         │    API     │           │   fetch    │             │
│         └────────────┘           └────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## How Search Works

```
User Query: "MCP protocol"
     │
     ├─► DuckDuckGo API ──► Fast results
     │                         │
     └─► DuckDuckGo Lite ──► HTML scraping
         (on fallback)          │
                                ▼
                         ┌────────────┐
                         │   Merge    │
                         │ + Dedupe   │
                         └────────────┘
                                │
                                ▼
                         Final Results
```

## Development

```bash
# Run in development mode
bun run dev

# Build for production
bun run build

# Type check
bun run check
```

## License

MIT