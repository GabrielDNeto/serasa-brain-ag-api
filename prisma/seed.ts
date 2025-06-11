import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passHash = await bcrypt.hash('admin@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: passHash,
    },
    create: {
      username: 'admin',
      password: passHash,
    },
  });

  console.log('✅ User created', { adminUser });
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
