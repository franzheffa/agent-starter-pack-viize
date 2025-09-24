#!/usr/bin/env bash
set -euo pipefail

declare -A ROOTS=(
  [".""]="repo-root"
  ["src/frontends/live_api_react/frontend"]="live_api_react"
  ["src/frontends/adk_gemini_fullstack/frontend"]="adk_gemini_fullstack"
)

for R in "${!ROOTS[@]}"; do
  [ -d "$R" ] || continue
  mkdir -p "$R/public"
  echo "root=${ROOTS[$R]}" > "$R/public/root-id.txt"
  echo "→ wrote $R/public/root-id.txt = root=${ROOTS[$R]}"
done

git add -f public/root-id.txt 2>/dev/null || true
git add -f src/frontends/live_api_react/frontend/public/root-id.txt 2>/dev/null || true
git add -f src/frontends/adk_gemini_fullstack/frontend/public/root-id.txt 2>/dev/null || true
git commit -m "chore: add root-id markers" || true
git push origin HEAD:main
