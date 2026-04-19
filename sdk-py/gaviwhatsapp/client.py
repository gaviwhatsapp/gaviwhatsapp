"""GaviVentures WhatsApp API SDK for Python."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import requests


class WhatsAppError(Exception):
    """Raised when the API returns an error response."""

    def __init__(self, message: str, status: int, response: Any = None):
        super().__init__(message)
        self.status = status
        self.response = response


class WhatsApp:
    """Client for the GaviVentures WhatsApp API.

    Usage::

        from gaviwhatsapp import WhatsApp

        wa = WhatsApp(api_key="gv_...")
        wa.send(to="+919876543210", text="Hello!")
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://www.gaviventures.com",
    ):
        if not api_key:
            raise ValueError(
                "API key is required. "
                "Get one at https://www.gaviventures.com/whatsapp/settings/api-keys"
            )
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")
        self._session = requests.Session()
        self._session.headers.update(
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            }
        )

    # ── Public methods ────────────────────────────────────────

    def send(self, *, to: str, text: str) -> Dict[str, Any]:
        """Send a text message."""
        return self._post("/api/v1/messages/send", {"to": to, "text": text})

    def send_template(
        self,
        *,
        to: str,
        template: str,
        language: str = "en",
        variables: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Send a pre-approved template message."""
        body: Dict[str, Any] = {
            "to": to,
            "template": template,
            "language": language,
        }
        if variables:
            body["variables"] = variables
        return self._post("/api/v1/messages/template", body)

    def send_media(
        self,
        *,
        to: str,
        type: str,
        url: str,
        caption: Optional[str] = None,
        filename: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send a media message (image, video, document, audio)."""
        body: Dict[str, Any] = {"to": to, "type": type, "url": url}
        if caption:
            body["caption"] = caption
        if filename:
            body["filename"] = filename
        return self._post("/api/v1/messages/media", body)

    def get_messages(
        self,
        *,
        phone: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """Get message history."""
        params: Dict[str, str] = {}
        if phone:
            params["phone"] = phone
        if limit != 20:
            params["limit"] = str(limit)
        return self._get("/api/v1/messages", params=params)

    def get_templates(self, *, sync: bool = False) -> Dict[str, Any]:
        """List available templates."""
        params = {"sync": "true"} if sync else {}
        return self._get("/api/v1/templates", params=params)

    def broadcast(
        self,
        *,
        recipients: List[str],
        template: str,
        language: str = "en",
        variables_per_recipient: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        """Send a broadcast to multiple recipients."""
        body: Dict[str, Any] = {
            "recipients": recipients,
            "template": template,
            "language": language,
        }
        if variables_per_recipient:
            body["variables_per_recipient"] = variables_per_recipient
        return self._post("/api/v1/broadcasts", body)

    def register_webhook(
        self,
        *,
        url: str,
        events: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Register a webhook endpoint."""
        body: Dict[str, Any] = {"url": url}
        if events:
            body["events"] = events
        return self._post("/api/v1/webhooks", body)

    def list_webhooks(self) -> Dict[str, Any]:
        """List registered webhook endpoints."""
        return self._get("/api/v1/webhooks")

    # ── Internal helpers ──────────────────────────────────────

    def _post(self, path: str, body: Dict[str, Any]) -> Dict[str, Any]:
        resp = self._session.post(f"{self._base_url}{path}", json=body)
        return self._handle(resp)

    def _get(
        self,
        path: str,
        params: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        resp = self._session.get(f"{self._base_url}{path}", params=params)
        return self._handle(resp)

    def _handle(self, resp: requests.Response) -> Dict[str, Any]:
        data = resp.json()
        if not resp.ok:
            raise WhatsAppError(
                data.get("error", f"API error: {resp.status_code}"),
                resp.status_code,
                data,
            )
        return data
