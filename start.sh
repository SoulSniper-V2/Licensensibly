#!/usr/bin/env bash
set -euo pipefail

# Gooner — uniform start script
# Usage: ./start.sh [dev|build|prod] [--port 3000] [--hostname 0.0.0.0]
# Default: dev on 0.0.0.0:3000 with hot reload
# This script is the single entry point for local dev, CI, and prod. 
# It ensures: node check, deps install, env check, build/lint, and start.
# Update ONBOARDING_STEPS in src/lib/onboarding.ts when adding features — the onboarding panel will auto-update.

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="3000"
HOST="0.0.0.0"
MODE="dev"

for arg in "$@"; do
  case "$arg" in
    --port) shift; PORT="${1:-3000}"; shift ;;
    --port=*) PORT="${arg#*=}";;
    --hostname) shift; HOST="${1:-0.0.0.0}"; shift ;;
    --hostname=*) HOST="${arg#*=}";;
    dev|build|start|prod) MODE="$arg";;
  esac
done

if [[ "$MODE" == "prod" ]]; then MODE="start"; fi

echo "→ Gooner uniform start — mode=$MODE host=$HOST port=$PORT"
echo "  root=$ROOT"

# 1) Node version check
if ! command -v node >/dev/null 2>&1; then
  echo "✗ node not found — install Node 18+ from https://nodejs.org"
  exit 1
fi
echo "✓ node $(node -v) / npm $(npm -v)"

# 2) Env check — ensure AINSIDE gateway vars exist (fallback to defaults in src/lib/ai.ts)
if [[ ! -f "$ROOT/.env.local" && -f "$ROOT/.env.example" ]]; then
  echo "• .env.local missing — creating from .env.example"
  cp "$ROOT/.env.example" "$ROOT/.env.local"
fi
if [[ -f "$ROOT/.env.local" ]]; then
  echo "✓ .env.local present"
  # hide secrets in log
  grep -E "^AI_" "$ROOT/.env.local" | sed 's/=.*/=***/' || true
else
  echo "• no .env.local — using built-in defaults (http://192.168.1.204:20128/v1)"
fi

# 3) Install deps if needed
if [[ ! -d "$ROOT/node_modules" ]]; then
  echo "→ npm install (first run)"
  (cd "$ROOT" && npm install)
else
  echo "✓ node_modules present"
fi

# 4) Kill any existing dev on same port (avoid EADDRINUSE)
if lsof -i :"$PORT" >/dev/null 2>&1; then
  echo "• port $PORT in use — freeing (pkill next dev)"
  pkill -f "next dev" || true
  sleep 2
fi

# 5) Mode dispatch
case "$MODE" in
  dev)
    echo "→ npm run dev -- -H $HOST -p $PORT"
    echo "  Open: http://localhost:$PORT  and  http://$HOST:$PORT"
    echo "  AINSIDE: ag/gemini-3.6-flash-high via http://192.168.1.204:20128/v1"
    (cd "$ROOT" && exec npm run dev -- -H "$HOST" -p "$PORT")
    ;;
  build)
    echo "→ npm run build && npm run lint"
    (cd "$ROOT" && npm run build && npm run lint)
    ;;
  start)
    if [[ ! -d "$ROOT/.next" ]]; then
      echo "→ .next missing — building first"
      (cd "$ROOT" && npm run build)
    fi
    echo "→ npm run start -- -H $HOST -p $PORT"
    (cd "$ROOT" && exec npm run start -- -H "$HOST" -p "$PORT")
    ;;
  *)
    echo "Unknown mode: $MODE (use dev|build|start)"
    exit 1
    ;;
esac
