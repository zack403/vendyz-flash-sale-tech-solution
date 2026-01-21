import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findProductById(productId: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }
}
