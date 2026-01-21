import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { ProductResponseDto } from './dto/product-response.dto';
import { runTransaction } from '../database/transaction.util';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getAllProducts(): Promise<ProductResponseDto[]> {
    const products = await this.inventoryRepository.findAllProducts();

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  }

  async getProductById(productId: string): Promise<ProductResponseDto> {
    const product = await this.inventoryRepository.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async reserveStock(productId: string, quantity: number): Promise<void> {
    try {
      await runTransaction(this.prisma, async (tx) => {
        const lockedRows = await tx.$queryRaw<{ quantity: number }[]>`
          SELECT quantity
          FROM "Product"
          WHERE id = ${productId}
          FOR UPDATE
        `;

        if (lockedRows.length === 0) {
          throw new NotFoundException('Product not found');
        }

        const currentQuantity = lockedRows[0].quantity;

        if (currentQuantity < quantity) {
          throw new ConflictException('Out of stock');
        }

        await tx.product.update({
          where: { id: productId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });

        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: productId,
            type: 'StockReserved',
            payload: {
              productId,
              quantity,
            },
          },
        });
      });
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      console.error('Stock reservation failed', error);
      throw new InternalServerErrorException('Failed to reserve stock');
    }
  }
}
