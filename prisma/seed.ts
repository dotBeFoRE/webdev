import prisma from '../src/server/db';

async function main() {
  await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  });

  await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      isAdmin: true,
      name: 'Bob',
    },
  });

  await prisma.user.upsert({
    where: { email: 'charlie@prisma.io' },
    update: {},
    create: {
      email: 'charlie@prisma.io',
      isModerator: true,
      name: 'Charlie',
    },
  });

  await prisma.user.upsert({
    where: { email: 'davy@prisma.io' },
    update: {},
    create: {
      email: 'davy@prisma.io',
      name: 'Davy',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
