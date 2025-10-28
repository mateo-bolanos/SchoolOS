#!/bin/sh
set -o errexit
set -o nounset
set -o pipefail

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
