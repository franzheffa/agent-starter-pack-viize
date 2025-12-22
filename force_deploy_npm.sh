#!/bin/bash
# Ajouter les changements (suppression de pnpm-lock et nouveau package-lock)
git add .
git commit -m "fix(build): remove pnpm-lock to force npm usage on Vercel"
# Pousser les changements
git push origin main
