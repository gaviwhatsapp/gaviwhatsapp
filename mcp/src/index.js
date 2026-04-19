#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.GAVIVENTURES_API_URL || "https://www.gaviventures.com";

let API_KEY = process.env.GAVIVENTURES_API_KEY;
const keyArgIndex = process.argv.indexOf("--api-key");
if (keyArgIndex !== -1 && process.argv[keyArgIndex + 1]) {
  API_KEY = process.argv[keyArgIndex + 1];
}

if (!API_KEY) {
  console.error(
    "Error: API key required. Set GAVIVENTURES_API_KEY env var or pass --api-key <key>"
  );
  process.exit(1);
}

async function callApi(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }
  return data;
}

const server = new McpServer({
  name: "gaviwhatsapp",
  version: "0.1.0",
});

// ── Tool 1: Send text message ──────────────────────────────

server.registerTool(
  "send_message",
  {
    title: "Send WhatsApp Message",
    description:
      "Send a text message to a WhatsApp number. " +
      "Phone number must include country code (e.g. +919876543210). " +
      "This works for ongoing conversations. For first-time messages, use send_template instead.",
    inputSchema: {
      to: z.string().describe("Recipient phone number with country code, e.g. +919876543210"),
      text: z.string().describe("The message text to send"),
    },
  },
  async ({ to, text }) => {
    const result = await callApi("/api/v1/messages/send", {
      method: "POST",
      body: JSON.stringify({ to, text }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool 2: Send template message ──────────────────────────

server.registerTool(
  "send_template",
  {
    title: "Send WhatsApp Template Message",
    description:
      "Send a pre-approved template message. Templates are required for initiating " +
      "conversations (first message to a user). Use list_templates to see available templates. " +
      "Variables are key-value pairs like { '1': 'John', '2': 'Order #123' }.",
    inputSchema: {
      to: z.string().describe("Recipient phone number with country code"),
      template: z.string().describe("Template name (e.g. 'order_confirmation')"),
      language: z.string().optional().default("en").describe("Template language code"),
      variables: z
        .record(z.string(), z.string())
        .optional()
        .describe("Template variables as { '1': 'value1', '2': 'value2' }"),
    },
  },
  async ({ to, template, language, variables }) => {
    const result = await callApi("/api/v1/messages/template", {
      method: "POST",
      body: JSON.stringify({ to, template, language, variables }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool 3: Send media ─────────────────────────────────────

server.registerTool(
  "send_media",
  {
    title: "Send WhatsApp Media",
    description:
      "Send an image, video, document, or audio file via a public URL. " +
      "The URL must be publicly accessible. For documents, provide a filename.",
    inputSchema: {
      to: z.string().describe("Recipient phone number with country code"),
      type: z.enum(["image", "video", "document", "audio"]).describe("Media type"),
      url: z.string().url().describe("Publicly accessible URL of the media file"),
      caption: z.string().optional().describe("Optional caption (images/videos/documents)"),
      filename: z.string().optional().describe("Filename for documents (e.g. 'invoice.pdf')"),
    },
  },
  async ({ to, type, url, caption, filename }) => {
    const result = await callApi("/api/v1/messages/media", {
      method: "POST",
      body: JSON.stringify({ to, type, url, caption, filename }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool 4: Get messages ───────────────────────────────────

server.registerTool(
  "get_messages",
  {
    title: "Get WhatsApp Message History",
    description:
      "Retrieve sent message history. Optionally filter by phone number. " +
      "Returns delivery status (sent, delivered, read, failed).",
    inputSchema: {
      phone: z.string().optional().describe("Filter by recipient phone number"),
      limit: z.number().optional().default(20).describe("Max messages to return (1-100)"),
    },
  },
  async ({ phone, limit }) => {
    const params = new URLSearchParams();
    if (phone) params.set("phone", phone);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    const result = await callApi(`/api/v1/messages${qs ? `?${qs}` : ""}`);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool 5: List templates ─────────────────────────────────

server.registerTool(
  "list_templates",
  {
    title: "List WhatsApp Templates",
    description:
      "List available message templates. Templates are pre-approved message formats " +
      "required for starting conversations. Set sync=true to refresh from Meta.",
    inputSchema: {
      sync: z
        .boolean()
        .optional()
        .default(false)
        .describe("Pull latest templates from Meta (slower but up-to-date)"),
    },
  },
  async ({ sync }) => {
    const qs = sync ? "?sync=true" : "";
    const result = await callApi(`/api/v1/templates${qs}`);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool 6: Send broadcast ─────────────────────────────────

server.registerTool(
  "send_broadcast",
  {
    title: "Send WhatsApp Broadcast",
    description:
      "Send a template message to multiple recipients at once. " +
      "Requires an approved template name. Optionally provide per-recipient variables.",
    inputSchema: {
      recipients: z
        .array(z.string())
        .describe("Array of phone numbers with country codes"),
      template: z.string().describe("Approved template name"),
      language: z.string().optional().default("en").describe("Template language code"),
      variables_per_recipient: z
        .array(z.record(z.string(), z.string()))
        .optional()
        .describe(
          "Array of variable objects, one per recipient. " +
          "E.g. [{ '1': 'Alice' }, { '1': 'Bob' }]"
        ),
    },
  },
  async ({ recipients, template, language, variables_per_recipient }) => {
    const result = await callApi("/api/v1/broadcasts", {
      method: "POST",
      body: JSON.stringify({ recipients, template, language, variables_per_recipient }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool 7: Register webhook ───────────────────────────────

server.registerTool(
  "register_webhook",
  {
    title: "Register WhatsApp Webhook",
    description:
      "Register a URL to receive real-time WhatsApp events (incoming messages, " +
      "delivery receipts, read receipts). Returns a secret for HMAC signature verification.",
    inputSchema: {
      url: z.string().url().describe("HTTPS URL to receive webhook events"),
      events: z
        .array(z.enum(["message.received", "message.delivered", "message.read", "message.failed"]))
        .optional()
        .describe("Events to subscribe to (defaults to received + delivered + read)"),
    },
  },
  async ({ url, events }) => {
    const result = await callApi("/api/v1/webhooks", {
      method: "POST",
      body: JSON.stringify({ url, events }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Start ───────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
