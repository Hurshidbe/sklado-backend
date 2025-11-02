import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator";

class ProductItem {
  @ApiProperty({type : 'string' , default : '690648ec1d2854575b18ffb1'})
  @IsMongoId()
  productId: string;

  @ApiProperty({type : 'number' , default : 12})
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  marketId?: string;

  @ApiProperty({type : [ProductItem]})
  @IsArray()
  products: ProductItem[];
}

import { IsOptional, IsString, IsDateString } from 'class-validator';

export class OrderFilterDto {
  @ApiProperty({type : 'string' , enum : ['new', 'accepted' , 'rejected'], default : ''})
  @IsOptional()
  @IsString()
  status?: 'new' | 'accepted' | 'delivered';

  @ApiProperty({type : Date.toString , default :''})
  @IsOptional()
  @IsDateString()
  from?: string; 

  @ApiProperty({type : Date.toString , default :''})
  @IsOptional()
  @IsDateString()
  to?: string;
  
  @ApiProperty({type : 'string' , default :''})
  @IsOptional()
  @IsString()
  marketId? : string
}
