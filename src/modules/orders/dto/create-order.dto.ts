import { IsArray, IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator";

class ProductItem {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  marketId?: string;

  @IsArray()
  products: ProductItem[];
}

import { IsOptional, IsString, IsDateString } from 'class-validator';

export class OrderFilterDto {
  @IsOptional()
  @IsString()
  status?: 'new' | 'accepted' | 'delivered';

  @IsOptional()
  @IsDateString()
  from?: string; 

  @IsOptional()
  @IsDateString()
  to?: string;
  
  @IsOptional()
  @IsString()
  marketId? : string
}
