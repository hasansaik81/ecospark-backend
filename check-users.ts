import { prisma } from './src/lib/prisma';
(async () => {
  const users = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log('Users:', users);
  await prisma.$disconnect();
})();
