#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APPDIR="$ROOT/packaging/App"

echo "==> Clean packaging/App"
rm -rf "$APPDIR"
mkdir -p "$APPDIR"

echo "==> Build frontend"
pushd "$ROOT/frontend" >/dev/null
npm install
npm run build
popd >/dev/null

echo "==> Prepare backend (prod)"
pushd "$ROOT/backend" >/dev/null
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
popd >/dev/null

echo "==> Copy files"
mkdir -p "$APPDIR/frontend" "$APPDIR/backend" "$APPDIR/runtime"
rsync -a "$ROOT/frontend/dist/" "$APPDIR/frontend/dist/"
rsync -a --exclude=vendor --exclude=storage/logs --exclude=.env.example "$ROOT/backend/" "$APPDIR/backend/"
# ensure storage + sqlite exist
mkdir -p "$APPDIR/backend/storage/logs"
touch "$APPDIR/backend/database/database.sqlite"

# copy runtime (Caddyfile, scripts)
rsync -a "$ROOT/runtime/caddy/" "$APPDIR/runtime/caddy/"
rsync -a "$ROOT/runtime/run/" "$APPDIR/runtime/run/"

# copy Windows binaries (you must place them in runtime/windows beforehand)
if [ ! -f "$ROOT/runtime/windows/caddy.exe" ] || [ ! -f "$ROOT/runtime/windows/php/php-cgi.exe" ]; then
  echo "!! Missing Windows binaries in runtime/windows. Add caddy.exe and PHP NTS first."
  exit 1
fi
rsync -a "$ROOT/runtime/windows/" "$APPDIR/runtime/windows/"

echo "==> Ensure backend .env uses sqlite relative path"
ENV_FILE="$APPDIR/backend/.env"
cp "$ROOT/backend/.env" "$ENV_FILE"
# Normalize DB settings
perl -0777 -pe "s/APP_ENV=.*/APP_ENV=production/s; s/APP_DEBUG=.*/APP_DEBUG=false/s; s|DB_CONNECTION=.*|DB_CONNECTION=sqlite|s; s|DB_DATABASE=.*|DB_DATABASE=database/database.sqlite|s" "$ENV_FILE" > "$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE"

echo "==> Create single EXE with NSIS"
pushd "$ROOT/packaging/nsis" >/dev/null
makensis installer.nsi
popd >/dev/null

echo "==> Done. Find OfflineApp.exe in packaging/"
