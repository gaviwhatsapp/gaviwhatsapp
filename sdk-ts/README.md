# @gaviwhatsapp/whatsapp

WhatsApp API SDK for Node.js. Send messages, templates, media, and broadcasts.

## Install

```bash
npm install @gaviwhatsapp/whatsapp
```

## Quick Start

```typescript
import { WhatsApp } from '@gaviwhatsapp/whatsapp'

const wa = new WhatsApp({ apiKey: process.env.GAVIVENTURES_API_KEY! })

// Send a text message
await wa.send({ to: '+919876543210', text: 'Hello!' })

// Send a template message
await wa.sendTemplate({
  to: '+919876543210',
  template: 'order_confirmation',
  variables: { '1': 'ORD-1234', '2': '$49.99' },
})

// Send media
await wa.sendMedia({
  to: '+919876543210',
  type: 'image',
  url: 'https://example.com/photo.jpg',
  caption: 'Your receipt',
})

// List templates
const { templates } = await wa.getTemplates()

// Send broadcast
await wa.broadcast({
  recipients: ['+919876543210', '+919876543211'],
  template: 'promo_offer',
})

// Register webhook
const webhook = await wa.registerWebhook({
  url: 'https://myapp.com/api/webhook',
  events: ['message.received'],
})
```

## API Reference

| Method | Description |
|--------|-------------|
| `wa.send({ to, text })` | Send a text message |
| `wa.sendTemplate({ to, template, language?, variables? })` | Send a template message |
| `wa.sendMedia({ to, type, url, caption?, filename? })` | Send media (image/video/document/audio) |
| `wa.getMessages({ phone?, limit? })` | Get message history |
| `wa.getTemplates({ sync? })` | List available templates |
| `wa.broadcast({ recipients, template, language?, variables_per_recipient? })` | Send to multiple recipients |
| `wa.registerWebhook({ url, events? })` | Register a webhook endpoint |
| `wa.listWebhooks()` | List registered webhooks |

## Get an API Key

Sign up at [gaviventures.com](https://www.gaviventures.com) and go to **Settings > API Keys**.
