#!/usr/bin/env bash
set -euo pipefail
PROJECT="buttertech-ai-platform"

echo "==> Vérification du compte gcloud actif…"
ACTIVE="$(gcloud config get-value account 2>/dev/null || true || :)"

if [[ -z "${ACTIVE}" ]]; then
  echo "==> Aucun compte actif. Lancement du flux de login (device) :"
  echo "   - Ouvre l’URL affichée"
  echo "   - Colle le code, puis autorise l’accès"
  gcloud auth login --no-launch-browser
fi

# Si toujours rien, prends le premier compte dispo
ACTIVE="$(gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null || true)"
if [[ -z "${ACTIVE}" ]]; then
  FIRST="$(gcloud auth list --format='value(account)' | head -n1)"
  if [[ -n "${FIRST}" ]]; then
    gcloud config set account "${FIRST}"
  fi
fi

echo "==> Projet"
gcloud config set project "${PROJECT}"

echo "==> Lancement du script gateway…"
bash setup_gateway.sh
