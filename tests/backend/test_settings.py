"""Unit tests for the Django settings module."""
from __future__ import annotations

import importlib
import sys
from pathlib import Path
from types import ModuleType
from typing import Mapping


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

SETTINGS_MODULE = "config.settings"


def _reload_settings(monkeypatch, env: Mapping[str, str] | None = None):
    """Reload the Django settings module with a clean environment."""
    tracked_keys = {
        "DJANGO_SECRET_KEY",
        "DJANGO_DEBUG",
        "DJANGO_ALLOWED_HOSTS",
        "DJANGO_CSRF_TRUSTED_ORIGINS",
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

    if env:
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


def test_default_security_configuration(monkeypatch):
    settings = _reload_settings(monkeypatch)

    assert settings.DEBUG is False
    assert settings.SECRET_KEY == "django-insecure-change-me"
    assert settings.ALLOWED_HOSTS == []
    assert settings.CSRF_TRUSTED_ORIGINS == []


def test_sqlite_database_configuration(monkeypatch, tmp_path):
    sqlite_name = tmp_path / "runtime.sqlite3"
    settings = _reload_settings(
        monkeypatch,
        {
            "DB_ENGINE": "django.db.backends.sqlite3",
            "SQLITE_NAME": str(sqlite_name),
        },
    )

    default_db = settings.DATABASES["default"]
    assert default_db["ENGINE"] == "django.db.backends.sqlite3"
    assert default_db["NAME"] == str(sqlite_name)


def test_allowed_hosts_and_csrf_parsing(monkeypatch):
    settings = _reload_settings(
        monkeypatch,
        {
            "DJANGO_ALLOWED_HOSTS": "api.schoolos.com, dashboard.schoolos.com , ",
            "DJANGO_CSRF_TRUSTED_ORIGINS": "https://schoolos.com, https://app.schoolos.com ",
        },
    )

    assert settings.ALLOWED_HOSTS == [
        "api.schoolos.com",
        "dashboard.schoolos.com",
    ]
    assert settings.CSRF_TRUSTED_ORIGINS == [
        "https://schoolos.com",
        "https://app.schoolos.com",
    ]


def test_rest_framework_defaults(monkeypatch):
    settings = _reload_settings(monkeypatch)

    assert settings.REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] == [
        "rest_framework.renderers.JSONRenderer"
    ]
    assert settings.REST_FRAMEWORK["DEFAULT_PARSER_CLASSES"] == [
        "rest_framework.parsers.JSONParser"
    ]
