import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProduct() {
  await prisma.product.deleteMany({});
  await prisma.product.deleteMany({});

  const products = [
    {
      name: 'Erythromycin (Cikamycin) 125mg/5ml x1',
      quantity: 1,
    },
    {
      name: 'ZOLAT (ALBENDAZOLE 200MG BP) X 1000 NEW',
      quantity: 2,
    },
    {
      name: 'CEFTRIAXONE INJECTION (LIGNOCAINE +WATER)  1G',
      quantity: 3,
    },
  ];

  try {
    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          quantity: product.quantity,
        },
      });
    }
  } catch (error) {
    console.error('Transaction failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
