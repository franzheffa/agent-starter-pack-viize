#!/usr/bin/env bash
set -euo pipefail

GATEWAY_URL="https://agent-smith-heffa-112329442315.us-central1.run.app"
BACKEND_URL="https://agent-smith-heffa-112329442315.us-central1.run.app"

echo "== Gateway /health"
curl -sS "${GATEWAY_URL}/health"; echo

echo "== Gateway /agents/echo (POST)"
curl -sS -X POST "${GATEWAY_URL}/agents/echo" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello depuis gateway"}'; echo

echo "== Backend /health"
curl -sS "${BACKEND_URL}/health"; echo

echo "== Backend /api (POST)"
curl -sS -X POST "${BACKEND_URL}/api" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello direct backend"}'; echo

echo
echo "NOTE: /api en GET retournera 405 (normal). Utilise POST."
