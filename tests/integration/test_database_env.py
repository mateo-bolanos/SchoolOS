"""Integration tests ensuring environment variables map to Django settings."""
from __future__ import annotations

import importlib
import sys
from pathlib import Path
from types import ModuleType


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

SETTINGS_MODULE = "config.settings"


def _reload_settings(monkeypatch, env):
    tracked_keys = {
        "SECRET_KEY",
        "DEBUG",
        "ALLOWED_HOSTS",
        "CSRF_TRUSTED_ORIGINS",
        "CORS_ALLOWED_ORIGINS",
        "ENABLE_SECURE_HEADERS",
        "ENABLE_MOCK_DATA",
        "ENVIRONMENT",
        "SECURE_SSL_REDIRECT",
        "SECURE_HSTS_SECONDS",
        "DJANGO_SECRET_KEY",
        "DJANGO_DEBUG",
        "DJANGO_ALLOWED_HOSTS",
        "DJANGO_CSRF_TRUSTED_ORIGINS",
        "DJANGO_CORS_ALLOWED_ORIGINS",
        "DJANGO_ENABLE_MOCK_DATA",
        "DJANGO_ENV",
        "DB_ENGINE",
        "SQLITE_NAME",
        "POSTGRES_DB",
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_HOST",
        "POSTGRES_PORT",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_PORT",
    }

    for key in tracked_keys:
        monkeypatch.delenv(key, raising=False)

    for key, value in env.items():
        monkeypatch.setenv(key, value)

    if "dotenv" not in sys.modules:
        stub = ModuleType("dotenv")

        def _load_dotenv(_path=None):
            return False

        stub.load_dotenv = _load_dotenv  # type: ignore[attr-defined]
        sys.modules["dotenv"] = stub

    modules_to_purge = [
        module
        for module in list(sys.modules)
        if module == SETTINGS_MODULE or module.startswith(f"{SETTINGS_MODULE}.")
    ]
    for module in modules_to_purge:
        sys.modules.pop(module, None)

    return importlib.import_module(SETTINGS_MODULE)


def test_postgres_environment_configuration(monkeypatch):
    settings = _reload_settings(
        monkeypatch,
        {
            "DB_ENGINE": "django.db.backends.postgresql",
            "POSTGRES_DB": "schoolos_ci",
            "POSTGRES_USER": "ci_user",
            "POSTGRES_PASSWORD": "ci_secret",
            "POSTGRES_HOST": "postgres",
            "POSTGRES_PORT": "5433",
        },
    )

    default_db = settings.DATABASES["default"]
    assert default_db["ENGINE"] == "django.db.backends.postgresql"
    assert default_db["NAME"] == "schoolos_ci"
    assert default_db["USER"] == "ci_user"
    assert default_db["PASSWORD"] == "ci_secret"
    assert default_db["HOST"] == "postgres"
    assert default_db["PORT"] == "5433"


def test_combined_security_settings(monkeypatch):
    settings = _reload_settings(
        monkeypatch,
        {
            "ALLOWED_HOSTS": "api.schoolos.test, admin.schoolos.test",
            "CSRF_TRUSTED_ORIGINS": "https://api.schoolos.test,https://admin.schoolos.test",
            "DEBUG": "1",
            "SECRET_KEY": "integration-secret",
        },
    )

    assert settings.ALLOWED_HOSTS == [
        "api.schoolos.test",
        "admin.schoolos.test",
    ]
    assert settings.CSRF_TRUSTED_ORIGINS == [
        "https://api.schoolos.test",
        "https://admin.schoolos.test",
    ]
    assert settings.DEBUG is True
    assert settings.SECRET_KEY == "integration-secret"
