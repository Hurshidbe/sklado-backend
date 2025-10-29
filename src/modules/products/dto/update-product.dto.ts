import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString, Length, Max } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
        @IsOptional()
        @IsString()
        @Length(1,100)
        name? : string
    
        @IsOptional()
        @IsString()
        unit? : string
}
