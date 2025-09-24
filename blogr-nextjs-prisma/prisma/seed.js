const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Franz",
      email: "franz@example.com",
      posts: {
        create: {
          title: "🚀 Premier post",
          content: "Ton app Next.js + Prisma est connectée à Postgres 🎉",
          published: true,
        },
      },
    },
  });
  console.log("✅ Seed terminé :", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
