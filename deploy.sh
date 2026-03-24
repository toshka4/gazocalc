#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Деплой «Калькулятор газобетона» на сервер
# Использование: ./deploy.sh [user@host]
# По умолчанию: root@185.148.38.218
# ============================================================

SERVER="${1:-root@185.148.38.218}"
REMOTE_DIR="/opt/gazocalc"

echo "==> Деплой на $SERVER:$REMOTE_DIR"

# Список файлов/каталогов для загрузки
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude 'admin/node_modules' \
  --exclude 'admin/dist' \
  --exclude 'backend/node_modules' \
  --exclude 'backend/dist' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.production' \
  ./ "$SERVER:$REMOTE_DIR/"

echo "==> Файлы загружены. Сборка и запуск контейнеров..."

ssh "$SERVER" bash -s <<'REMOTE'
  set -euo pipefail
  cd /opt/gazocalc

  # Убедимся, что сеть Traefik существует
  docker network inspect proxy >/dev/null 2>&1 || \
    docker network create proxy

  # Проверяем наличие .env.production
  if [ ! -f .env.production ]; then
    echo "ОШИБКА: .env.production не найден на сервере!"
    echo "Скопируйте .env.production.example → .env.production и заполните значения."
    exit 1
  fi

  # Сборка и запуск
  docker compose -f docker-compose.prod.yml build --pull
  docker compose -f docker-compose.prod.yml up -d

  echo ""
  echo "==> Статус контейнеров:"
  docker compose -f docker-compose.prod.yml ps

  echo ""
  echo "==> Деплой завершён."
REMOTE
