import { IsInt, IsPositive, IsString } from 'class-validator';

export class ReserveStockDto {
  @IsString()
  productId!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;
}
