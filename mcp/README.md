# @gaviwhatsapp/mcp

MCP (Model Context Protocol) server for the GaviVentures WhatsApp API.

Add WhatsApp messaging to Cursor, Claude Code, OpenAI Codex, and other AI coding tools.

## Setup

### 1. Get an API key

Go to [gaviventures.com/whatsapp/settings/api-keys](https://www.gaviventures.com/whatsapp/settings/api-keys) and create one.

### 2. Add to your AI tool config

**Cursor** — add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "gaviwhatsapp": {
      "command": "npx",
      "args": ["@gaviwhatsapp/mcp", "--api-key", "gv_YOUR_KEY"]
    }
  }
}
```

**Claude Code** — add to `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "gaviwhatsapp": {
      "command": "npx",
      "args": ["@gaviwhatsapp/mcp", "--api-key", "gv_YOUR_KEY"]
    }
  }
}
```

### 3. Use it

Just ask your AI assistant:

- "Send a WhatsApp message to +919876543210 saying hello"
- "List my WhatsApp templates"
- "Send the order_confirmation template to +919876543210 with order ID ORD-1234"
- "Send a broadcast to these 5 numbers with the promo_offer template"

## Available Tools

| Tool | Description |
|------|-------------|
| `send_message` | Send a text message |
| `send_template` | Send a pre-approved template message |
| `send_media` | Send image, video, document, or audio |
| `get_messages` | Get message delivery history |
| `list_templates` | List available templates |
| `send_broadcast` | Send to multiple recipients |
| `register_webhook` | Register a webhook for real-time events |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GAVIVENTURES_API_KEY` | Your API key (alternative to `--api-key` flag) |
| `GAVIVENTURES_API_URL` | API base URL (defaults to `https://www.gaviventures.com`) |
