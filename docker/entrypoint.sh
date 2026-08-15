#!/bin/sh
set -e

DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"

echo "PostgreSQL bekleniyor (${DB_HOST}:${DB_PORT})..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL hazır."

if [ -f schema.sql ]; then
  echo "Veritabanı şeması uygulanıyor..."
  export PGPASSWORD="${DB_PASSWORD}"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f schema.sql
  echo "Şema uygulandı."
fi

if [ -f scripts/seed-admin.js ]; then
  echo "Admin hesabı kontrol ediliyor..."
  if node scripts/seed-admin.js; then
    echo "Admin seed tamam."
  else
    echo "Admin seed atlandı (uygulama yine başlıyor)."
  fi
fi

echo "Next.js başlatılıyor..."
exec node server.js
