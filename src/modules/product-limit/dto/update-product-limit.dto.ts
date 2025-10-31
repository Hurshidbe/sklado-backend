import { PartialType } from '@nestjs/mapped-types';
import { CreateProductLimitDto } from './create-product-limit.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProductLimitDto extends PartialType(CreateProductLimitDto) {
    
        @IsMongoId()
        @IsNotEmpty()
        productId : Types.ObjectId
    
        @IsOptional()
        amount : number
    
        @IsOptional()
        days : number
}
