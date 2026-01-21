import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

export async function runTransaction<T>(
  prisma: PrismaService,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => fn(tx));
}
