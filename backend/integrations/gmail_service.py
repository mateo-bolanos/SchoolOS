"""Gmail API helpers for SchoolOS."""

from __future__ import annotations

import base64
import os
from dataclasses import dataclass
from email.message import EmailMessage
from typing import Any, Iterable, List, Mapping, Optional


@dataclass
class GmailConfig:
    """Configuration container for the Gmail API."""

    application_name: str
    scopes: tuple[str, ...]

    @classmethod
    def from_env(cls, env: Optional[Mapping[str, str]] = None) -> "GmailConfig":
        env_mapping = env or os.environ
        default_scopes = (
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.readonly",
        )
        raw_scopes = env_mapping.get("GOOGLE_GMAIL_SCOPES")
        scopes = (
            tuple(scope.strip() for scope in raw_scopes.split(",") if scope.strip())
            if raw_scopes
            else default_scopes
        )
        return cls(
            application_name=env_mapping.get("GOOGLE_GMAIL_APP", "SchoolOS"),
            scopes=scopes,
        )


def _build_gmail_service(credentials):
    try:
        from googleapiclient.discovery import build
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "google-api-python-client is required for Gmail integration"
        ) from exc
    return build("gmail", "v1", credentials=credentials, cache_discovery=False)


class GmailService:
    """Wrapper around Gmail API functionality used by SchoolOS."""

    def __init__(
        self,
        credentials,
        *,
        config: Optional[GmailConfig] = None,
    ) -> None:
        self._credentials = credentials
        self.config = config or GmailConfig.from_env()
        self._service_client = None

    def _get_service(self):
        if self._service_client is None:
            self._service_client = _build_gmail_service(self._credentials)
        return self._service_client

    def build_message(
        self,
        *,
        sender: str,
        to: Iterable[str],
        subject: str,
        body: str,
        cc: Optional[Iterable[str]] = None,
        bcc: Optional[Iterable[str]] = None,
    ) -> EmailMessage:
        """Create an RFC 822 email message for Gmail."""

        message = EmailMessage()
        message["From"] = sender
        message["To"] = ", ".join(to)
        if cc:
            message["Cc"] = ", ".join(cc)
        if bcc:
            message["Bcc"] = ", ".join(bcc)
        message["Subject"] = subject
        message.set_content(body)
        return message

    def send_message(self, message: EmailMessage, *, user_id: str = "me") -> Mapping[str, Any]:
        """Send a prepared EmailMessage using Gmail API."""

        raw_bytes = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")
        request = self._get_service().users().messages().send(
            userId=user_id,
            body={"raw": raw_bytes},
        )
        return request.execute()

    def list_messages(
        self,
        *,
        user_id: str = "me",
        label_ids: Optional[Iterable[str]] = None,
        max_results: int = 20,
        page_token: Optional[str] = None,
    ) -> List[Mapping[str, Any]]:
        params: dict[str, Any] = {"maxResults": max_results}
        if label_ids:
            params["labelIds"] = list(label_ids)
        if page_token:
            params["pageToken"] = page_token
        response = (
            self._get_service()
            .users()
            .messages()
            .list(userId=user_id, **params)
            .execute()
        )
        return list(response.get("messages", []))

    def get_message(
        self,
        message_id: str,
        *,
        user_id: str = "me",
        format: str = "full",
    ) -> Mapping[str, Any]:
        request = (
            self._get_service()
            .users()
            .messages()
            .get(userId=user_id, id=message_id, format=format)
        )
        return request.execute()


__all__ = [
    "GmailConfig",
    "GmailService",
]
