# Installation Guide

## Installation Methods

### Method 1: Using bunx (recommended)

```json
{
  "mcpServers": {
    "web-search": {
      "command": "bunx",
      "args": ["-y", "@sthbryan/web-search-mcp"]
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
      "args": ["-y", "@sthbryan/web-search-mcp"]
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
        "args": ["-y", "@sthbryan/web-search-mcp"]
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
      "args": ["-y", "@sthbryan/web-search-mcp"]
    }
  }
}
```

Cursor also supports UI configuration: Settings → Features → Model Context Protocol

---

### OpenCode

| OS | Path |
|----|------|
| macOS | `~/.config/opencode/opencode.json` |
| Linux | `~/.config/opencode/opencode.json` |
| Windows | `%APPDATA%\opencode\opencode.json` |

```json
{
  "mcp": {
    "obscura": {
      "type": "local",
      "command": ["bunx", "-y", "@sthbryan/web-search-mcp"],
      "environment": {
        "OBSCURA_PATH": "/usr/local/bin/obscura"
      },
      "enabled": true
    }
  }
}
```

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
      "args": ["-y", "@sthbryan/web-search-mcp"]
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

### Codex

| OS | Path |
|----|------|
| macOS | `~/.codex/config.json` |
| Linux | `~/.codex/config.json` |
| Windows | `%USERPROFILE%\.codex\config.json` |

```json
{
  "mcpServers": {
    "obscura": {
      "command": "bunx",
      "args": ["-y", "@sthbryan/web-search-mcp"]
    }
  }
}
```

---

### Pi

Add to your MCP servers config:
To use MCP servers with Pi, you need to install the `pi-mcp-adapter` package and configure it to connect to the Obscura MCP server.
Link to package: https://pi.dev/packages/pi-mcp-adapter


```json
{
  "mcpServers": {
    "web-search": {
      "command": "bunx",
      "args": ["-y", "@sthbryan/web-search-mcp"]
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