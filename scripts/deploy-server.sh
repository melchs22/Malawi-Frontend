#!/usr/bin/env bash
set -eu

cd /opt/smart-mobility/frontend
backup=".next.rollback-$(date -u +%Y%m%d%H%M%S)"
modules_backup="node_modules.rollback-$(date -u +%Y%m%d%H%M%S)"
systemctl stop smart-mobility-admin.service
if [ -d .next ]; then
  mv .next "$backup"
fi
if [ -d node_modules ]; then
  mv node_modules "$modules_backup"
fi

restore_previous_build() {
  if [ -d "$backup" ]; then
    rm -rf -- .next
    mv "$backup" .next
  fi
  if [ -d "$modules_backup" ]; then
    rm -rf -- node_modules
    mv "$modules_backup" node_modules
  fi
  systemctl restart smart-mobility-admin.service
}

if ! runuser -u smartmobility -- env HOME=/var/lib/smartmobility bash -c \
  'cd /opt/smart-mobility/frontend && npm ci && npm run build'; then
  restore_previous_build
  exit 1
fi

if ! systemctl restart smart-mobility-admin.service; then
  restore_previous_build
  exit 1
fi

for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if curl --fail --silent --show-error --output /dev/null \
    http://127.0.0.1:3000/sys-admin/users/audit; then
    if [ -d "$backup" ]; then
      rm -rf -- "$backup"
    fi
    if [ -d "$modules_backup" ]; then
      rm -rf -- "$modules_backup"
    fi
    echo "Admin dashboard deployed and responding."
    exit 0
  fi
  sleep 2
done
restore_previous_build
echo "Dashboard health check failed after restart." >&2
exit 1
