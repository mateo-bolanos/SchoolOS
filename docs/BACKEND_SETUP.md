# Backend Setup Guide

## Overview
SchoolOS uses a Django REST Framework backend with environment-driven settings. Follow these steps to prepare a local developer environment before adding new apps or endpoints.

## Prerequisites
- Python 3.12 or later (matches the target runtime in the system design).
- PostgreSQL 14+ (default configuration) or SQLite for quick prototyping.
- `pip` for dependency management and `virtualenv` support.

## 1. Clone the repository
```bash
# HTTPS
https://github.com/mateo-bolanos/SchoolOS.git
cd SchoolOS

# or SSH
git@github.com:mateo-bolanos/SchoolOS.git
```

## 2. Create a virtual environment
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
```

## 3. Install dependencies
Install the packages required by the current Django project structure:
```bash
pip install "Django>=5.0" djangorestframework python-dotenv "psycopg[binary]"
```

## 4. Configure environment variables
Copy the sample environment file and adjust values as needed.
```bash
cp .env.example .env
```
Key variables:
- `DJANGO_SECRET_KEY` – application secret.
- `DJANGO_DEBUG` – set to `0` in non-development environments.
- `DJANGO_ALLOWED_HOSTS` – comma-separated hostnames.
- `DB_ENGINE` – defaults to PostgreSQL; set to `django.db.backends.sqlite3` for SQLite.
- `POSTGRES_*` values – connection details for PostgreSQL instances.

## 5. Prepare the database
With PostgreSQL running locally (or SQLite configured), apply migrations:
```bash
python manage.py migrate
```
Create a superuser for admin access when the admin site becomes available:
```bash
python manage.py createsuperuser
```

## 6. Run the development server
```bash
python manage.py runserver 0.0.0.0:8000
```
The API will load the default apps (`core`, `api`) and DRF utilities registered in `INSTALLED_APPS`.

## 7. Next steps
- Start modelling domain data inside `backend/api` and `backend/core`.
- Add DRF serializers and viewsets under `backend/api/`.
- Keep `.env.example` in sync with new configuration keys.
