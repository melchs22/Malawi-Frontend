#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

command -v rsync >/dev/null || { echo "rsync is required" >&2; exit 1; }
command -v npm >/dev/null || { echo "npm is required" >&2; exit 1; }
if [ "${DEPLOY_LOCAL:-0}" != "1" ]; then
  : "${DEPLOY_HOST:?Set DEPLOY_HOST to the production server host}"
  : "${DEPLOY_USER:?Set DEPLOY_USER to the SSH deployment account}"
  command -v ssh >/dev/null || { echo "ssh is required" >&2; exit 1; }
fi

cd "$ROOT_DIR"
npm ci
npm run build

REMOTE_DIR="/opt/smart-mobility/frontend"
SYNC_OPTIONS=(
  --exclude='/.git/'
  --exclude='/node_modules/'
  --exclude='/.next/'
  --exclude='/.env'
  --exclude='/.env.*'
  --exclude='/auth.db'
  --exclude='/auth.db-*'
  --exclude='/data/'
  --exclude='/public/uploads/'
  --exclude='*.log'
  --exclude='.DS_Store'
  --exclude='._*'
)

if [ "${DEPLOY_LOCAL:-0}" = "1" ]; then
  rsync -azO --delete-delay "${SYNC_OPTIONS[@]}" \
    "$ROOT_DIR/" "${REMOTE_DIR}/"
  bash "$ROOT_DIR/scripts/deploy-server.sh"
else
  REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
  rsync -azO --delete-delay \
    --rsync-path="runuser -u smartmobility -- rsync" \
    "${SYNC_OPTIONS[@]}" \
    -e "ssh -o BatchMode=yes -o StrictHostKeyChecking=yes" \
    "$ROOT_DIR/" "${REMOTE}:${REMOTE_DIR}/"
  ssh -o BatchMode=yes -o StrictHostKeyChecking=yes "$REMOTE" \
    'bash -s' < "$ROOT_DIR/scripts/deploy-server.sh"
fi
