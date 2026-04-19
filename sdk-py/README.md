# gaviwhatsapp

WhatsApp API SDK for Python. Send messages, templates, media, and broadcasts.

## Install

```bash
pip install gaviwhatsapp
```

## Quick Start

```python
import os
from gaviwhatsapp import WhatsApp

wa = WhatsApp(api_key=os.environ["GAVIVENTURES_API_KEY"])

# Send a text message
wa.send(to="+919876543210", text="Hello!")

# Send a template message
wa.send_template(
    to="+919876543210",
    template="order_confirmation",
    variables={"1": "ORD-1234", "2": "$49.99"},
)

# Send media
wa.send_media(
    to="+919876543210",
    type="image",
    url="https://example.com/photo.jpg",
    caption="Your receipt",
)

# List templates
result = wa.get_templates()
print(result["templates"])

# Send broadcast
wa.broadcast(
    recipients=["+919876543210", "+919876543211"],
    template="promo_offer",
)

# Register webhook
webhook = wa.register_webhook(
    url="https://myapp.com/api/webhook",
    events=["message.received"],
)
print(webhook["secret"])  # Save for HMAC verification
```

## API Reference

| Method | Description |
|--------|-------------|
| `wa.send(to, text)` | Send a text message |
| `wa.send_template(to, template, language?, variables?)` | Send a template message |
| `wa.send_media(to, type, url, caption?, filename?)` | Send media |
| `wa.get_messages(phone?, limit?)` | Get message history |
| `wa.get_templates(sync?)` | List available templates |
| `wa.broadcast(recipients, template, language?, variables_per_recipient?)` | Send to multiple recipients |
| `wa.register_webhook(url, events?)` | Register a webhook endpoint |
| `wa.list_webhooks()` | List registered webhooks |

## Get an API Key

Sign up at [gaviventures.com](https://www.gaviventures.com) and go to **Settings > API Keys**.
```
