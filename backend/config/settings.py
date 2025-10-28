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


# Security
SECRET_KEY = _getenv(["SECRET_KEY", "DJANGO_SECRET_KEY"], "django-insecure-change-me")
DEBUG = _getenv(["DEBUG", "DJANGO_DEBUG"], "0") == "1"

ALLOWED_HOSTS = _split_env_list(_getenv(["ALLOWED_HOSTS", "DJANGO_ALLOWED_HOSTS"]))
if not ALLOWED_HOSTS and DEBUG:
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

CSRF_TRUSTED_ORIGINS = _split_env_list(
    _getenv(["CSRF_TRUSTED_ORIGINS", "DJANGO_CSRF_TRUSTED_ORIGINS"])
)
if not CSRF_TRUSTED_ORIGINS and DEBUG:
    CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

CORS_ALLOWED_ORIGINS = _split_env_list(
    _getenv(["CORS_ALLOWED_ORIGINS", "DJANGO_CORS_ALLOWED_ORIGINS"])
)
if not CORS_ALLOWED_ORIGINS and DEBUG:
    CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
ENVIRONMENT = os.getenv("DJANGO_ENV", "development").lower()
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-change-me")
DEBUG = os.getenv(
    "DJANGO_DEBUG", "0" if ENVIRONMENT == "production" else "1"
) == "1"


def _env_list_with_fallback(
    env_key: str, dev_default: Iterable[str], *, setting_name: str
) -> list[str]:
    values = _split_env_list(os.getenv(env_key, ""))
    if values:
        return values
    if ENVIRONMENT in {"development", "local"}:
        return list(dev_default)
    raise ImproperlyConfigured(
        f"{setting_name} must be configured via {env_key} in production environments."
    )


ALLOWED_HOSTS = _env_list_with_fallback(
    "DJANGO_ALLOWED_HOSTS", ["localhost", "127.0.0.1"], setting_name="ALLOWED_HOSTS"
)

CSRF_TRUSTED_ORIGINS = _env_list_with_fallback(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    ["http://localhost:3000"],
    setting_name="CSRF_TRUSTED_ORIGINS",
)

CORS_ALLOWED_ORIGINS = _env_list_with_fallback(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    ["http://localhost:3000"],
    setting_name="CORS_ALLOWED_ORIGINS",
)
CORS_ALLOW_CREDENTIALS = True

SECURE_HEADERS_ENABLED = _getenv(
    ["ENABLE_SECURE_HEADERS", "DJANGO_ENABLE_SECURE_HEADERS"], "0"
) == "1"
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

# Database configuration
_default_engine = os.getenv(
    "DB_ENGINE",
    "django.db.backends.postgresql"
    if ENVIRONMENT == "production"
    else "django.db.backends.sqlite3",
)
if _default_engine == "django.db.backends.sqlite3":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.getenv("SQLITE_NAME", str(BASE_DIR / "db.sqlite3")),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": _default_engine,
            "NAME": os.getenv("POSTGRES_DB", os.getenv("DB_NAME", "schoolos")),
            "USER": os.getenv("POSTGRES_USER", os.getenv("DB_USER", "schoolos")),
            "PASSWORD": os.getenv(
                "POSTGRES_PASSWORD", os.getenv("DB_PASSWORD", "schoolos")
            ),
            "HOST": os.getenv("POSTGRES_HOST", os.getenv("DB_HOST", "localhost")),
            "PORT": os.getenv("POSTGRES_PORT", os.getenv("DB_PORT", "5432")),
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

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}

ENABLE_MOCK_DATA = os.getenv(
    "DJANGO_ENABLE_MOCK_DATA", "1" if ENVIRONMENT != "production" else "0"
) == "1"
