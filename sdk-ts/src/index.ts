export interface WhatsAppConfig {
  apiKey: string
  baseUrl?: string
}

export interface SendParams {
  to: string
  text: string
}

export interface SendTemplateParams {
  to: string
  template: string
  language?: string
  variables?: Record<string, string>
}

export interface SendMediaParams {
  to: string
  type: "image" | "video" | "document" | "audio"
  url: string
  caption?: string
  filename?: string
}

export interface BroadcastParams {
  recipients: string[]
  template: string
  language?: string
  variables_per_recipient?: Record<string, string>[]
}

export interface RegisterWebhookParams {
  url: string
  events?: ("message.received" | "message.delivered" | "message.read" | "message.failed")[]
}

export interface GetMessagesParams {
  phone?: string
  limit?: number
}

export interface GetTemplatesParams {
  sync?: boolean
}

export interface MessageResult {
  message_id: string | null
  status: string
}

export interface BroadcastResult {
  broadcast_id: string
  total: number
  sent: number
  failed: number
  results: Array<{ to: string; status: string; message_id?: string; error?: string }>
}

export interface WebhookResult {
  id: string
  url: string
  secret: string
  events: string[]
  is_active: boolean
}

export interface TemplateInfo {
  id: string
  name: string
  status: string
  category: string
  language: string
  [key: string]: unknown
}

export interface MessageInfo {
  id: string
  to: string
  template: string | null
  status: string
  error: string | null
  sent_at: string | null
  delivered_at: string | null
  read_at: string | null
}

export class WhatsApp {
  private apiKey: string
  private baseUrl: string

  constructor(config: WhatsAppConfig) {
    if (!config.apiKey) {
      throw new Error(
        "API key is required. Get one at https://www.gaviventures.com/whatsapp/settings/api-keys"
      )
    }
    this.apiKey = config.apiKey
    this.baseUrl = (config.baseUrl || "https://www.gaviventures.com").replace(/\/$/, "")
  }

  async send(params: SendParams): Promise<MessageResult> {
    return this.post("/api/v1/messages/send", {
      to: params.to,
      text: params.text,
    })
  }

  async sendTemplate(params: SendTemplateParams): Promise<MessageResult> {
    return this.post("/api/v1/messages/template", {
      to: params.to,
      template: params.template,
      language: params.language || "en",
      variables: params.variables,
    })
  }

  async sendMedia(params: SendMediaParams): Promise<MessageResult> {
    return this.post("/api/v1/messages/media", {
      to: params.to,
      type: params.type,
      url: params.url,
      caption: params.caption,
      filename: params.filename,
    })
  }

  async getMessages(params?: GetMessagesParams): Promise<{ messages: MessageInfo[] }> {
    const qs = new URLSearchParams()
    if (params?.phone) qs.set("phone", params.phone)
    if (params?.limit) qs.set("limit", String(params.limit))
    const query = qs.toString()
    return this.get(`/api/v1/messages${query ? `?${query}` : ""}`)
  }

  async getTemplates(params?: GetTemplatesParams): Promise<{ templates: TemplateInfo[] }> {
    const qs = params?.sync ? "?sync=true" : ""
    return this.get(`/api/v1/templates${qs}`)
  }

  async broadcast(params: BroadcastParams): Promise<BroadcastResult> {
    return this.post("/api/v1/broadcasts", {
      recipients: params.recipients,
      template: params.template,
      language: params.language || "en",
      variables_per_recipient: params.variables_per_recipient,
    })
  }

  async registerWebhook(params: RegisterWebhookParams): Promise<WebhookResult> {
    return this.post("/api/v1/webhooks", {
      url: params.url,
      events: params.events,
    })
  }

  async listWebhooks(): Promise<{ webhooks: WebhookResult[] }> {
    return this.get("/api/v1/webhooks")
  }

  // ── Internal HTTP helpers ──────────────────────────────────

  private async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new WhatsAppError(data.error || `API error: ${res.status}`, res.status, data)
    }
    return data as T
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      throw new WhatsAppError(data.error || `API error: ${res.status}`, res.status, data)
    }
    return data as T
  }
}

/**
 * Verify a webhook signature from GaviVentures.
 * Use this in your webhook handler to ensure the request is authentic.
 *
 * Requires Node.js crypto (not available in edge/browser runtimes).
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const { createHmac } = await import("crypto")
  const expected = createHmac("sha256", secret).update(payload).digest("hex")
  return expected === signature
}

export class WhatsAppError extends Error {
  status: number
  response: unknown

  constructor(message: string, status: number, response: unknown) {
    super(message)
    this.name = "WhatsAppError"
    this.status = status
    this.response = response
  }
}
