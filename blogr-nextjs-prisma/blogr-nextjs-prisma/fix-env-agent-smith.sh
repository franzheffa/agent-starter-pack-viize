set -euo pipefail
SCOPE="buttertech-team"
PROJ="agent-smith-heffa"

# Lien local sûr
vercel link --project "$PROJ" --yes --scope "$SCOPE" >/dev/null

echo "== Avant =="
vercel env ls production --scope "$SCOPE" | sed -n '1,120p'

# 1) Retire les variables à priorité gênante
vercel env rm GITHUB_ID production --yes --scope "$SCOPE" || true
vercel env rm GITHUB_SECRET production --yes --scope "$SCOPE" || true

# 2) Pose UNIQUEMENT le couple CLIENT_ID/CLIENT_SECRET correct
printf %s "Ov23lio2oV5PMLTwGnQM" | vercel env add GITHUB_CLIENT_ID production --scope "$SCOPE"
printf %s "3a7f06574237e08e6f1b15727385ec6b11b57064" | vercel env add GITHUB_CLIENT_SECRET production --scope "$SCOPE"

# 3) NEXTAUTH_URL = domaine actuel (on migrera vers www.buttertech.io à l’étape 3)
printf %s "https://agent-smith-heffa.vercel.app" | vercel env add NEXTAUTH_URL production --scope "$SCOPE"

echo "== Après =="
vercel env ls production --scope "$SCOPE" | sed -n '1,120p'

# Pull local pour que Next.js de build sache ce qu'il y a en prod
vercel pull --yes --environment=production --scope "$SCOPE" >/dev/null || true
