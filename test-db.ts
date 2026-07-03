import { prisma } from './src/lib/prisma';
(async () => {
  await prisma.idea.updateMany({ data: { status: 'APPROVED' } });
  const ideas = await prisma.idea.findMany();
  console.log('Ideas approved:', ideas.length);
  await prisma.$disconnect();
})();
