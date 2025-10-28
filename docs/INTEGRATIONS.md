# Google Integrations

This document outlines how SchoolOS connects to Google Workspace services using OAuth2 credentials.

## OAuth2 Credentials

1. Create a **Google Cloud project** (or reuse the institution-wide project) and enable the following APIs:
   - Google People API (for profile data via OAuth2)
   - Google Classroom API
   - Gmail API
2. Configure an OAuth consent screen (external for production tenants).
3. Create an **OAuth 2.0 Client ID** of type *Web application* with the redirect URI configured in the backend (`GOOGLE_REDIRECT_URI`).
4. Store the resulting **Client ID** and **Client Secret** as environment variables (see [Environment Variables](#environment-variables)).

The backend uses the [google-auth-oauthlib](https://google-auth-oauthlib.readthedocs.io/) flow to exchange authorization codes for tokens. Refresh tokens are persisted by SchoolOS (database or AWS Secrets) and renewed transparently.

### Scopes

Default scopes loaded by the backend modules:

| Service | Scope | Purpose |
| --- | --- | --- |
| OAuth2 | `openid email profile` | Authenticate the user and fetch profile metadata |
| Classroom | `https://www.googleapis.com/auth/classroom.courses.readonly` | Read course roster and metadata |
| Classroom | `https://www.googleapis.com/auth/classroom.coursework.students` | Create and manage student coursework |
| Gmail | `https://www.googleapis.com/auth/gmail.send` | Send emails from the authenticated account |
| Gmail | `https://www.googleapis.com/auth/gmail.readonly` | Read email threads for in-app messaging |

Override scopes by setting `GOOGLE_AUTH_SCOPES`, `GOOGLE_CLASSROOM_SCOPES`, or `GOOGLE_GMAIL_SCOPES` in the environment. Values accept comma-separated lists.

## Backend Modules

| Module | Responsibility |
| --- | --- |
| `backend/integrations/google_oauth.py` | Generates Google OAuth2 authorization URLs, exchanges authorization codes, refreshes tokens, revokes tokens, and fetches user profile data. |
| `backend/integrations/google_classroom.py` | Wraps Google Classroom API calls for listing courses, managing coursework, and querying student submissions. |
| `backend/integrations/gmail_service.py` | Provides helpers for composing and sending Gmail messages, as well as listing and retrieving message metadata. |

Each module lazily instantiates the respective Google API client using `google-api-python-client`.

## Environment Variables

Define the following variables for the backend service (see `.env.example`):

| Variable | Description |
| --- | --- |
| `GOOGLE_CLIENT_ID` | OAuth2 web client ID generated in Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | OAuth2 client secret. |
| `GOOGLE_REDIRECT_URI` | Public callback URL (e.g., `https://api.schoolos.com/auth/google/callback`). |
| `GOOGLE_AUTH_SCOPES` | Optional custom scopes for OAuth2 login, comma-separated. |
| `GOOGLE_CLASSROOM_SCOPES` | Optional custom scopes for Classroom API usage. |
| `GOOGLE_CLASSROOM_APP` | Optional application name when interacting with Classroom. |
| `GOOGLE_GMAIL_SCOPES` | Optional custom scopes for Gmail API usage. |
| `GOOGLE_GMAIL_APP` | Optional application name when interacting with Gmail. |

Never commit actual secrets. For local development store values in `.env`, and in production retrieve them from AWS Secrets Manager.

## Token Handling

- Authorization code exchange occurs on the backend using the helper in `google_oauth.GoogleOAuthService.exchange_code`.
- Refresh tokens are renewed by calling `google_oauth.GoogleOAuthService.refresh`.
- Tokens can be revoked using `google_oauth.GoogleOAuthService.revoke` when unlinking an account.

## Testing Strategy

The repository includes mock-based unit tests (`tests/backend/test_google_integrations.py`) that validate the integration flow without calling Google APIs. Each test stubs the Google client factory to ensure deterministic behaviour.
