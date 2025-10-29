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