import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getProducts(): Promise<ProductResponseDto[]> {
    return this.inventoryService.getAllProducts();
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.inventoryService.getProductById(id);
  }
}
