import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { ProductResponseDto } from './dto/product-response.dto';
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
}
