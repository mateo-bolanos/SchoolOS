"""Django settings for SchoolOS backend project."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable, Sequence

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH)


def _getenv(keys: Sequence[str], default: str = "") -> str:
    """Return the first environment variable value found for the provided keys."""

    for key in keys:
        value = os.getenv(key)
        if value is not None:
            return value
    return default


def _split_env_list(raw_value: str) -> list[str]:
    return [item.strip() for item in raw_value.split(",") if item.strip()]


# --- Env helpers ---
ENVIRONMENT = _getenv(["ENVIRONMENT", "DJANGO_ENV"], "development").lower()

# Security
SECRET_KEY = _getenv(["SECRET_KEY", "DJANGO_SECRET_KEY"], "django-insecure-change-me")
DEBUG = _getenv(["DEBUG", "DJANGO_DEBUG"], "0" if ENVIRONMENT == "production" else "1") == "1"


def _env_list_with_fallback(
    keys: Sequence[str],
    dev_default: Iterable[str],
    *,
    setting_name: str,
) -> list[str]:
    values = _split_env_list(_getenv(keys))
    if values:
        return values
    # dev/local may use built-ins
    if ENVIRONMENT in {"development", "local"} or DEBUG:
        return list(dev_default)
    # prod must be explicit
    raise ImproperlyConfigured(
        f"{setting_name} must be configured via one of {', '.join(keys)} in production environments."
    )


ALLOWED_HOSTS = _env_list_with_fallback(
    ["ALLOWED_HOSTS", "DJANGO_ALLOWED_HOSTS"],
    ["localhost", "127.0.0.1"],
    setting_name="ALLOWED_HOSTS",
)

CSRF_TRUSTED_ORIGINS = _env_list_with_fallback(
    ["CSRF_TRUSTED_ORIGINS", "DJANGO_CSRF_TRUSTED_ORIGINS"],
    ["http://localhost:3000"],
    setting_name="CSRF_TRUSTED_ORIGINS",
)

CORS_ALLOWED_ORIGINS = _env_list_with_fallback(
    ["CORS_ALLOWED_ORIGINS", "DJANGO_CORS_ALLOWED_ORIGINS"],
    ["http://localhost:3000"],
    setting_name="CORS_ALLOWED_ORIGINS",
)
CORS_ALLOW_CREDENTIALS = True

SECURE_HEADERS_ENABLED = _getenv(["ENABLE_SECURE_HEADERS", "DJANGO_ENABLE_SECURE_HEADERS"], "0") == "1"
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
SESSION_COOKIE_SAMESITE = os.getenv("DJANGO_SESSION_COOKIE_SAMESITE", "Lax")
CSRF_COOKIE_SAMESITE = os.getenv("DJANGO_CSRF_COOKIE_SAMESITE", "Lax")
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = "DENY"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

if SECURE_HEADERS_ENABLED:
    SECURE_SSL_REDIRECT = _getenv(
        ["SECURE_SSL_REDIRECT", "DJANGO_SECURE_SSL_REDIRECT"], "1"
    ) == "1"
    SECURE_HSTS_SECONDS = int(
        _getenv(["SECURE_HSTS_SECONDS", "DJANGO_SECURE_HSTS_SECONDS"], "31536000")
    )
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
else:
    SECURE_SSL_REDIRECT = False
    SECURE_HSTS_SECONDS = 0
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False


def _split_env_tuple(env_keys: Sequence[str], default: Iterable[str]) -> tuple[str, ...]:
    values = _split_env_list(_getenv(env_keys))
    return tuple(values) if values else tuple(default)


CSP_DEFAULT_SRC = _split_env_tuple(("CSP_DEFAULT_SRC", "DJANGO_CSP_DEFAULT_SRC"), ("'self'",))
CSP_SCRIPT_SRC = _split_env_tuple(("CSP_SCRIPT_SRC", "DJANGO_CSP_SCRIPT_SRC"), ("'self'",))
CSP_STYLE_SRC = _split_env_tuple(("CSP_STYLE_SRC", "DJANGO_CSP_STYLE_SRC"), ("'self'",))

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "csp",
    "rest_framework",
    "core",
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "csp.middleware.CSPMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database
_default_engine = _getenv(
    ["DB_ENGINE"],
    "django.db.backends.postgresql" if ENVIRONMENT == "production" else "django.db.backends.sqlite3",
)
if _default_engine == "django.db.backends.sqlite3":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": _getenv(["SQLITE_NAME"], str(BASE_DIR / "db.sqlite3")),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": _default_engine,
            "NAME": _getenv(["POSTGRES_DB", "DB_NAME"], "schoolos"),
            "USER": _getenv(["POSTGRES_USER", "DB_USER"], "schoolos"),
            "PASSWORD": _getenv(["POSTGRES_PASSWORD", "DB_PASSWORD"], "schoolos"),
            "HOST": _getenv(["POSTGRES_HOST", "DB_HOST"], "localhost"),
            "PORT": _getenv(["POSTGRES_PORT", "DB_PORT"], "5432"),
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DRF configuration
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}

# Mock data toggle (define only once)
ENABLE_MOCK_DATA = _getenv(
    ["ENABLE_MOCK_DATA", "DJANGO_ENABLE_MOCK_DATA"],
    "1" if ENVIRONMENT != "production" else "0",
) == "1"
