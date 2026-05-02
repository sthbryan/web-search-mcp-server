# Installation Guide

## Installation Methods

### Method 1: Using bunx (recommended)

```json
{
  "mcpServers": {
    "web-search": {
      "command": "bunx",
      "args": ["web-search-mcp-server"]
    }
  }
}
```

### Method 2: Using bun (from built files)

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

### Method 3: Using npx

```json
{
  "mcpServers": {
    "web-search": {
      "command": "npx",
      "args": ["-y", "web-search-mcp-server"]
    }
  }
}
```

### Method 4: Using local clone

```bash
git clone https://github.com/sthbryan/web-search-mcp-server
cd web-search-mcp-server
bun install
bun run build
```

```json
{
  "mcpServers": {
    "web-search": {
      "command": "bunx",
      "args": ["run", "/path/to/web-search-mcp-server/src/index.ts"]
    }
  }
}
```

---

## Client Configuration

### VSCode

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Code/User/settings.json` |
| Linux | `~/.config/Code/User/settings.json` |
| Windows | `%APPDATA%\Code\User\settings.json` |

```json
{
  "mcp": {
    "servers": {
      "web-search": {
        "command": "bunx",
        "args": ["web-search-mcp-server"]
      }
    }
  }
}
```

---

### Cursor

| OS | Path |
|----|------|
| macOS | `~/.cursor/mcp.json` |
| Linux | `~/.cursor/mcp.json` |
| Windows | `%USERPROFILE%\.cursor\mcp.json` |

```json
{
  "mcpServers": {
    "web-search": {
      "type": "stdio",
      "command": "bunx",
      "args": ["web-search-mcp-server"]
    }
  }
}
```

Cursor also supports UI configuration: Settings → Features → Model Context Protocol

---

### Claude Code

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "web-search": {
      "command": "bunx",
      "args": ["web-search-mcp-server"]
    }
  }
}
```

Or via CLI:
```bash
claude mcp add web-search bunx web-search-mcp-server
claude mcp list
```

---

### Pi

Add to your MCP servers config (`~/.pi/agent/mcp.json`):

```json
{
  "mcpServers": {
    "web-search": {
      "command": "bunx",
      "args": ["web-search-mcp-server"]
    }
  }
}
```

---

## Troubleshooting

### Server not starting
- Verify Bun is installed: `bun --version`
- Run manually: `bunx web-search-mcp-server`

### No search results
- Check internet connection
- DuckDuckGo may be rate-limiting (wait and retry)

### "Cache" issue (server shows as "not connected")
- Delete `~/.pi/agent/mcp-cache.json`
- Restart the client