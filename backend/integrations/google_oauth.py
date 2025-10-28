"""Google OAuth2 helpers for SchoolOS."""
from __future__ import annotations

import os
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Mapping, Optional, Sequence, Tuple, cast

try:  # pragma: no cover - optional dependency import
    from typing import Protocol
except ImportError:  # pragma: no cover
    Protocol = object  # type: ignore

if os.environ.get("GOOGLE_AUTH_SCOPES"):
    _DEFAULT_SCOPES = tuple(
        scope.strip()
        for scope in os.environ["GOOGLE_AUTH_SCOPES"].split(",")
        if scope.strip()
    )
else:
    _DEFAULT_SCOPES = (
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/classroom.courses.readonly",
    )

_TOKEN_URI = "https://oauth2.googleapis.com/token"
_REVOKE_URI = "https://oauth2.googleapis.com/revoke"


class _FlowFactory(Protocol):  # pragma: no cover - typing helper
    def from_client_config(
        self,
        client_config: Mapping[str, Mapping[str, str]],
        scopes: Sequence[str],
        redirect_uri: Optional[str] = None,
    ):
        ...


@dataclass
class GoogleOAuthConfig:
    """Configuration container for Google OAuth2."""

    client_id: str
    client_secret: str
    redirect_uri: str
    scopes: Tuple[str, ...]
    prompt: str = "consent"
    access_type: str = "offline"
    include_granted_scopes: bool = True

    @classmethod
    def from_env(cls, env: Optional[Mapping[str, str]] = None) -> "GoogleOAuthConfig":
        """Create configuration using environment variables."""

        env_mapping: Mapping[str, str] = env or os.environ
        client_id = env_mapping.get("GOOGLE_CLIENT_ID")
        client_secret = env_mapping.get("GOOGLE_CLIENT_SECRET")
        redirect_uri = env_mapping.get("GOOGLE_REDIRECT_URI")
        if not client_id or not client_secret or not redirect_uri:
            missing = [
                name
                for name, value in (
                    ("GOOGLE_CLIENT_ID", client_id),
                    ("GOOGLE_CLIENT_SECRET", client_secret),
                    ("GOOGLE_REDIRECT_URI", redirect_uri),
                )
                if not value
            ]
            raise ValueError(
                "Missing Google OAuth configuration values: " + ", ".join(missing)
            )

        raw_scopes = env_mapping.get("GOOGLE_AUTH_SCOPES")
        scopes = (
            tuple(scope.strip() for scope in raw_scopes.split(",") if scope.strip())
            if raw_scopes
            else _DEFAULT_SCOPES
        )
        return cls(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scopes=scopes,
            prompt=env_mapping.get("GOOGLE_OAUTH_PROMPT", "consent"),
            access_type=env_mapping.get("GOOGLE_OAUTH_ACCESS_TYPE", "offline"),
            include_granted_scopes=env_mapping.get(
                "GOOGLE_OAUTH_INCLUDE_GRANTED",
                "1",
            )
            not in {"0", "false", "False"},
        )

    @property
    def client_config(self) -> Mapping[str, Mapping[str, str]]:
        """Return a client configuration payload compatible with google-auth."""

        return {
            "web": {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uris": [self.redirect_uri],
                "token_uri": _TOKEN_URI,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            }
        }


def _get_flow_factory() -> _FlowFactory:
    try:
        from google_auth_oauthlib.flow import Flow
    except ImportError as exc:  # pragma: no cover - executed only without deps
        raise RuntimeError(
            "google-auth-oauthlib is required for Google OAuth operations"
        ) from exc
    return Flow


def _build_request():
    try:
        from google.auth.transport.requests import Request
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "google-auth library is required for Google OAuth operations"
        ) from exc
    return Request()


def _credentials_class():
    try:
        from google.oauth2.credentials import Credentials
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "google-auth library is required for Google OAuth operations"
        ) from exc
    return Credentials


def _build_discovery_service(api: str, version: str, credentials):
    try:
        from googleapiclient.discovery import build
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "google-api-python-client is required for Google OAuth operations"
        ) from exc
    return build(api, version, credentials=credentials, cache_discovery=False)


class GoogleOAuthService:
    """Encapsulates OAuth2 authorization for Google sign-in."""

    def __init__(self, config: GoogleOAuthConfig):
        self.config = config

    def build_flow(self) -> object:
        """Instantiate an OAuth2 flow using the configured credentials."""

        flow_factory = _get_flow_factory()
        flow = flow_factory.from_client_config(  # type: ignore[call-arg]
            self.config.client_config,
            scopes=self.config.scopes,
            redirect_uri=self.config.redirect_uri,
        )
        return flow

    def generate_authorization_url(self, *, state: Optional[str] = None) -> Tuple[str, str]:
        """Return the Google authorization URL and resulting state."""

        flow = self.build_flow()
        authorization_url, resolved_state = flow.authorization_url(  # type: ignore[attr-defined]
            access_type=self.config.access_type,
            include_granted_scopes=self.config.include_granted_scopes,
            prompt=self.config.prompt,
            state=state,
        )
        return authorization_url, resolved_state

    def exchange_code(self, *, code: str) -> "Credentials":
        """Exchange an authorization code for tokens."""

        flow = self.build_flow()
        flow.fetch_token(code=code)  # type: ignore[attr-defined]
        credentials = getattr(flow, "credentials", None)
        if credentials is None:
            raise RuntimeError("Failed to obtain credentials from Google OAuth flow")
        return cast("Credentials", credentials)

    def refresh(self, *, refresh_token: str) -> "Credentials":
        """Refresh an access token using the stored refresh token."""

        credentials_cls = _credentials_class()
        credentials = credentials_cls(
            token=None,
            refresh_token=refresh_token,
            token_uri=_TOKEN_URI,
            client_id=self.config.client_id,
            client_secret=self.config.client_secret,
            scopes=self.config.scopes,
        )
        request = _build_request()
        credentials.refresh(request)  # type: ignore[attr-defined]
        return cast("Credentials", credentials)

    def revoke(self, token: str) -> bool:
        """Revoke the provided token. Returns ``True`` when Google acknowledges."""

        data = urllib.parse.urlencode({"token": token}).encode("utf-8")
        request = urllib.request.Request(
            _REVOKE_URI,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        with urllib.request.urlopen(request) as response:  # nosec B310 - Google endpoint
            return 200 <= response.getcode() < 300

    def get_user_profile(self, credentials: "Credentials") -> Mapping[str, object]:
        """Fetch the authenticated user's profile from Google."""

        service = _build_discovery_service("oauth2", "v2", credentials)
        request = service.userinfo().get()  # type: ignore[attr-defined]
        return cast(Mapping[str, object], request.execute())

