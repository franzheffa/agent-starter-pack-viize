import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'test@buttertech.ai' },
    update: {},
    create: {
      email: 'test@buttertech.ai',
      name: 'Test Pilot',
      posts: {
        create: {
          title: 'Bienvenue chez Buttertech',
          content: 'Ceci est un post de test généré par Agent Smith.',
          published: true,
        },
      },
    },
  })
  console.log('Seed terminé : Base de données prête pour la validation.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
