#!/bin/bash
# Nettoyage des scripts temporaires
rm -f victory_push.sh cleanup_locks.sh force_deploy_npm.sh

# Commit et Push
git add .
git commit -m "fix(build): align relative paths with Vercel root directory settings"
git push origin main
