const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const idea = await prisma.idea.findUnique({
    where: { id: '8aff8404-2bb3-470a-9c37-5d7b426e79f6' }
  });
  console.log("Idea Details:", idea);
}

main().catch(console.error).finally(() => prisma.$disconnect());
