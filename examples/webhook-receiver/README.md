# Webhook Receiver

Express server that receives and verifies incoming WhatsApp webhook events (message received, delivered, read, etc.).

## Setup

```bash
npm install
```

## Run

```bash
export WEBHOOK_SECRET=whsec_your_secret
npm start
```

The server listens on `http://localhost:3001/webhook`.

## Register the Webhook

Use the API or SDK to register this URL:

```bash
curl -X POST https://www.gaviventures.com/api/v1/webhooks \
  -H "Authorization: Bearer gv_your_key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-public-url/webhook", "events": ["message.received", "message.delivered"]}'
```

Use [ngrok](https://ngrok.com) or a similar tool to expose localhost during development.
