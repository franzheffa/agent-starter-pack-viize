set -euo pipefail
FILES=(
  "$HOME/Downloads/agent-starter-pack-viize-2/blogr-nextjs-prisma/blogr-nextjs-prisma/pages/api/auth/[...nextauth].ts"
  "$HOME/Downloads/agent-starter-pack-viize/blogr-nextjs-prisma/blogr-nextjs-prisma/pages/api/auth/[...nextauth].ts"
)
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  cp "$f" "${f}.bak.$(date +%s)"
  perl -0777 -pe 's/session:\s*\{\s*strategy:\s*"(?:database|jwt)"\s*\}/session: { strategy: "jwt" }/s' -i "$f"
  echo "Patched session to JWT in: $f"
done
