
set -euo pipefail
echo "👉 Prisma generate"
npx prisma generate
echo "👉 Prisma migrate deploy"
npx prisma migrate deploy
echo "👉 Next build"
npm run build --silent
