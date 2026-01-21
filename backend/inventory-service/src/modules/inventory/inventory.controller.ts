import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { ReserveStockDto } from './dto/reserve-stock.dto';
import { InternalAuthGuard } from '../auth/internal-auth.guard';

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

  @UseGuards(InternalAuthGuard)
  @Post('/reserve')
  async reserveStock(
    @Body() dto: ReserveStockDto,
  ): Promise<{ status: 'reserved' }> {
    await this.inventoryService.reserveStock(dto.productId, dto.quantity);

    return { status: 'reserved' };
  }
}
