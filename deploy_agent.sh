#!/bin/bash
# 1. Nettoyage des résidus de build
rm -rf .next

# 2. Synchronisation Git
git add .
git commit -m "fix(auth): align redirect_uri for www.buttertech.io and cleanup env vars"
git push origin main --force

echo "🚀 Déploiement envoyé ! Vérifie les logs sur Vercel."
