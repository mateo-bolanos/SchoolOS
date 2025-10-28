# Deployment Guide

## Overview
The repository currently ships a Django REST Framework backend without a production frontend bundle. This document explains how to prepare and deploy the backend service to a production-like environment. Update this guide as additional services (frontend SPA, workers, infrastructure scripts) are introduced.

## Pre-deployment checklist
- Provision a PostgreSQL instance and record credentials.
- Create a `.env` file for production values.
- Build a Python virtual environment with all runtime dependencies installed.
- Decide on the preferred application server (`gunicorn` for WSGI or `uvicorn` for ASGI).

## Environment configuration
1. Copy `backend/.env.example` to a secure location and update secrets:
   - Set `DJANGO_SECRET_KEY` to a long random string.
   - Set `DJANGO_DEBUG=0`.
   - List trusted domains in `DJANGO_ALLOWED_HOSTS`.
   - Provide PostgreSQL credentials through `POSTGRES_*` variables.
2. Export the variables or supply them through a `.env` file loaded at startup.

## Database setup
1. Ensure the database server is reachable from the application host.
2. Apply migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```
3. Create an administrative account if interactive access is required:
   ```bash
   python manage.py createsuperuser
   ```

## Static files
Collect static assets into the configured `STATIC_ROOT`:
```bash
python manage.py collectstatic --noinput
```
Serve the resulting directory (`backend/staticfiles/` by default) through your chosen web server or CDN.

## Application server
### Gunicorn (WSGI)
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```
### Uvicorn (ASGI)
```bash
uvicorn config.asgi:application --host 0.0.0.0 --port 8000
```
Wrap the process with a system service manager (systemd, Supervisor, or container orchestration) for resiliency and logging.

## Health checks and monitoring
- Expose an HTTP health endpoint (e.g., `/admin/login/` or a lightweight custom view) once implemented.
- Forward application logs to centralized storage and set up metrics collection (Prometheus/Sentry planned).

## Deployment status tracking
Log each deployment in project documentation with:
- Date and target environment.
- Git commit SHA and tags.
- Database migration state.
- Outstanding manual post-deploy actions.
