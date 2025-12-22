#!/bin/bash
# Supprimer les traces de pnpm
rm -f pnpm-lock.yaml
rm -rf node_modules
# S'assurer que le package-lock.json est propre
rm -f package-lock.json
# Réinstaller proprement avec npm
npm install
