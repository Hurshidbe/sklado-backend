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
  @ApiProperty({type : [ProductItem]})
  @IsArray()
  products: ProductItem[];
}

import { IsOptional, IsString, IsDateString } from 'class-validator';

export class OrderFilterDto {
  @ApiProperty({type : 'string' , enum : ['new', 'accepted' , 'rejected'], default : '', required : false})
  @IsOptional()
  @IsString()
  status?: 'new' | 'accepted' | 'delivered';

  @ApiProperty({type : Date.toString , default :'', required : false})
  @IsOptional()
  @IsDateString()
  from?: string; 

  @ApiProperty({type : Date.toString , default :'', required : false
  })
  @IsOptional()
  @IsDateString()
  to?: string;
  
  @ApiProperty({type : 'string' , default :'', required : false})
  @IsOptional()
  @IsString()
  marketId? : string
}
