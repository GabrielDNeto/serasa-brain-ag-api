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

  const producer = await prisma.producer.create({
    data: {
      name: 'João da Silva',
      document: '12345678900',
      city: 'Uberlândia',
      state: 'MG',
    },
  });

  // Cria uma propriedade
  const property = await prisma.property.create({
    data: {
      name: 'Fazenda Bela Vista',
      city: 'Uberlândia',
      state: 'MG',
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 400,
      producerId: producer.id,
    },
  });

  // Cria 2 safras para a propriedade
  const harvest2023 = await prisma.harvest.create({
    data: {
      year: 2023,
      propertyId: property.id,
    },
  });

  const harvest2024 = await prisma.harvest.create({
    data: {
      year: 2024,
      propertyId: property.id,
    },
  });

  // Cria culturas para as safras
  await prisma.crop.createMany({
    data: [
      {
        name: 'Soja',
        propertyId: property.id,
        harvestId: harvest2023.id,
      },
      {
        name: 'Milho',
        propertyId: property.id,
        harvestId: harvest2023.id,
      },
      {
        name: 'Algodão',
        propertyId: property.id,
        harvestId: harvest2024.id,
      },
    ],
  });

  console.log('✅ Seed succeed!', {
    adminUser,
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
