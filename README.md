# Gavi WhatsApp API

The WhatsApp API built for how developers actually build in 2026. Works in Cursor, Claude Code, Codex, and Lovable.

**MCP server** · **TypeScript SDK** · **Python SDK** · **Examples** · **$9.99/mo**

[![npm](https://img.shields.io/npm/v/@gaviwhatsapp/whatsapp)](https://www.npmjs.com/package/@gaviwhatsapp/whatsapp)
[![npm](https://img.shields.io/npm/v/@gaviwhatsapp/mcp)](https://www.npmjs.com/package/@gaviwhatsapp/mcp)
[![PyPI](https://img.shields.io/pypi/v/gaviwhatsapp)](https://pypi.org/project/gaviwhatsapp/)

---

## What is this?

A complete WhatsApp Business API platform with:

- **MCP Server** — Type "send a WhatsApp message" in Cursor or Claude Code and it just works
- **REST API** — 6 endpoints: send message, send template, send media, broadcasts, webhooks, contacts
- **TypeScript SDK** — `npm install @gaviwhatsapp/whatsapp`
- **Python SDK** — `pip install gaviwhatsapp`
- **Dashboard** — Visual form builder, conversation flows, broadcast campaigns, analytics

## Quick Start

### Option 1: MCP Server (AI coding tools)

Add to `.cursor/mcp.json` or `.claude/mcp.json`:

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

Then just ask: *"Send a WhatsApp message to +919876543210 saying hello"*

### Option 2: TypeScript SDK

```bash
npm install @gaviwhatsapp/whatsapp
```

```typescript
import { WhatsApp } from '@gaviwhatsapp/whatsapp'

const wa = new WhatsApp({ apiKey: process.env.GAVIWHATSAPP_API_KEY! })
await wa.send({ to: '+919876543210', text: 'Hello from my app!' })
```

### Option 3: Python SDK

```bash
pip install gaviwhatsapp
```

```python
from gaviwhatsapp import WhatsApp

wa = WhatsApp(api_key="gv_YOUR_KEY")
wa.send(to="+919876543210", text="Hello from my app!")
```

### Option 4: REST API

```bash
curl -X POST https://www.gaviventures.com/api/v1/messages \
  -H "Authorization: Bearer gv_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to": "+919876543210", "text": "Hello!"}'
```

## Get an API Key

1. Sign up at [gaviventures.com](https://www.gaviventures.com)
2. Connect your WhatsApp Business Account
3. Go to **Settings > API Keys**

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [`@gaviwhatsapp/mcp`](./mcp) | MCP server for Cursor, Claude Code, Codex | `npx @gaviwhatsapp/mcp` |
| [`@gaviwhatsapp/whatsapp`](./sdk-ts) | TypeScript/Node.js SDK | `npm install @gaviwhatsapp/whatsapp` |
| [`gaviwhatsapp`](./sdk-py) | Python SDK | `pip install gaviwhatsapp` |

## Examples

| Example | Description | Language |
|---------|-------------|----------|
| [send-message-ts](./examples/send-message-ts) | Send a text message | TypeScript |
| [send-message-python](./examples/send-message-python) | Send a text message | Python |
| [broadcast-campaign](./examples/broadcast-campaign) | Send personalized broadcast from CSV | TypeScript |
| [webhook-receiver](./examples/webhook-receiver) | Receive incoming WhatsApp messages | TypeScript |

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/messages` | Send a text message |
| POST | `/api/v1/messages/template` | Send a template message |
| POST | `/api/v1/messages/media` | Send media (image/video/document) |
| POST | `/api/v1/broadcasts` | Send to multiple recipients |
| POST | `/api/v1/webhooks` | Register a webhook |
| GET | `/api/v1/webhooks` | List webhooks |

Full docs: [gaviventures.com/docs/api](https://www.gaviventures.com/docs/api)

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| API | $9.99/mo | API, SDKs, MCP server, webhooks, broadcasts |
| Pro | $24.99/mo | Everything + visual builder, forms, flows, analytics |

7-day free trial. No credit card required. Meta per-message charges billed directly to your WhatsApp Business Account.

## Links

- [Website](https://www.gaviventures.com)
- [API Documentation](https://www.gaviventures.com/docs/api)
- [npm: @gaviwhatsapp/whatsapp](https://www.npmjs.com/package/@gaviwhatsapp/whatsapp)
- [npm: @gaviwhatsapp/mcp](https://www.npmjs.com/package/@gaviwhatsapp/mcp)
- [PyPI: gaviwhatsapp](https://pypi.org/project/gaviwhatsapp/)

## License

MIT
