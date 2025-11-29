
set -euo pipefail

say() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }
ok()  { printf "   \033[1;32m[OK]\033[0m %s\n" "$*"; }
ko()  { printf "   \033[1;31m[KO]\033[0m %s\n" "$*"; }

say "Détection du sous-dossier Next.js (contenant pages/)"
CANDIDATES=(
  "blogr-nextjs-prisma/blogr-nextjs-prisma"
  "blogr-nextjs-prisma"
  "."
)
APP_DIR=""
for d in "${CANDIDATES[@]}"; do
  if [ -d "$d/pages" ]; then APP_DIR="$d"; break; fi
done
if [ -z "${APP_DIR}" ]; then
  ko "Aucun dossier avec pages/ trouvé. Vérifie l'arborescence."
  exit 1
fi
ok "APP_DIR=$APP_DIR"

say "Arborescence utile (croppée)"
find "$APP_DIR" -maxdepth 3 -type d \( -name pages -o -name lib -o -name prisma -o -name components \) -print
find "$APP_DIR/pages" -maxdepth 3 -type f | sed 's#^# - #'


say "Vérification existence fichiers clés"
check_file() {
  local f="$1"
  if [ -f "$f" ]; then ok "$f"; else ko "$f manquant"; fi
}
check_file "$APP_DIR/lib/prisma.ts"
check_file "$APP_DIR/prisma/schema.prisma"
check_file "$APP_DIR/pages/_app.tsx"
check_file "$APP_DIR/pages/api/auth/[...nextauth].ts"
check_file "$APP_DIR/pages/api/post/index.ts"
check_file "$APP_DIR/pages/api/post/[id].ts"
check_file "$APP_DIR/pages/api/publish/[id].ts"

say "Vérification next.config"
if [ -f "$APP_DIR/next.config.cjs" ]; then
  ok "$APP_DIR/next.config.cjs présent"
else
  ko "$APP_DIR/next.config.cjs manquant"
fi
if [ -f "$APP_DIR/next.config.js" ]; then
  ko "$APP_DIR/next.config.js trouvé (doit être supprimé si 'type: module')"
else
  ok "Aucun next.config.js (OK)"
fi


say "Vérification vercel.json (racine du repo)"
if [ -f "vercel.json" ]; then
  ok "vercel.json présent"
  printf "\n--- vercel.json ---\n"
  sed -n '1,200p' vercel.json
else
  ko "vercel.json manquant (pas bloquant, mais recommandé)"
fi

say "Inspection package.json"
PKG="$APP_DIR/package.json"
[ -f "$PKG" ] || PKG="package.json"
if [ -f "$PKG" ]; then
  ok "$PKG"
  node -e "const p=require(process.argv[1]);console.log(JSON.stringify({name:p.name, next:p.dependencies?.next||p.devDependencies?.next, react:p.dependencies?.react, 'react-dom':p.dependencies?.['react-dom'], 'next-auth':(p.dependencies?.['next-auth']||p.devDependencies?.['next-auth']), prisma:p.devDependencies?.prisma, '@prisma/client':p.dependencies?.['@prisma/client'], type:p.type},null,2));" "$PKG"
else
  ko "package.json introuvable"
fi

say "Prisma: version et validation du schéma"
npx prisma --version || ko "prisma non installé"
if npx prisma validate >/dev/null 2>&1; then
  ok "prisma validate OK"
else
  ko "prisma validate a échoué"
fi

say "ENV: contrôle des principales variables (masquées)"
ENV_FILE=""
if [ -f "$APP_DIR/.env.local" ]; then ENV_FILE="$APP_DIR/.env.local"
elif [ -f "$APP_DIR/.env" ]; then ENV_FILE="$APP_DIR/.env"
elif [ -f ".env.local" ]; then ENV_FILE=".env.local"
elif [ -f ".env" ]; then ENV_FILE=".env"
fi

if [ -n "$ENV_FILE" ]; then
  ok "ENV fichier = $ENV_FILE"
  awk -F= '/^(POSTGRES_|DATABASE_URL|NEXTAUTH_|GITHUB_)/{printf "   %s=***\n",$1}' "$ENV_FILE" | sed 's/^/   /'
else
  ko "Aucun .env(.local) trouvé"
fi

say "Grep rapides pour s'assurer du contenu attendu"
grep -nE 'PrismaAdapter|providers|GitHubProvider' "$APP_DIR/pages/api/auth/[...nextauth].ts" && ok "NextAuth: providers/adapter OK" || ko "NextAuth incomplet"
grep -nE 'new PrismaClient|global\.prisma' "$APP_DIR/lib/prisma.ts" && ok "Singleton Prisma OK" || ko "lib/prisma.ts incomplet"
grep -nE 'model User|model Post' "$APP_DIR/prisma/schema.prisma" && ok "Schéma Prisma: User/Post OK" || ko "Schéma Prisma incomplet"


say "TypeScript --noEmit (best-effort)"
if npx tsc --version >/dev/null 2>&1; then
  if npx tsc -p "$APP_DIR/tsconfig.json" --noEmit 2>/tmp/ts.err; then
    ok "Type-check OK"
  else
    ko "Type-check erreurs"; sed -n '1,120p' /tmp/ts.err
  fi
else
  ko "tsc non disponible; skip"
fi


say "Test build Next local (optionnel, passera si tout est correct)"
if npx next --version >/dev/null 2>&1; then
  (cd "$APP_DIR" && npx next build >/tmp/next.build.log 2>&1 && ok "next build OK") || { ko "next build KO"; sed -n '1,160p' /tmp/next.build.log; }
else
  ko "next CLI non dispo (npm i peut être nécessaire)"
fi

say "Vérifications terminées."
