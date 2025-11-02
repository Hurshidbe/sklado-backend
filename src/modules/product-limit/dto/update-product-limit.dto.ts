import { PartialType } from '@nestjs/mapped-types';
import { CreateProductLimitDto } from './create-product-limit.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductLimitDto extends PartialType(CreateProductLimitDto) {
    
           @ApiProperty({type : 'string' , example :'690648ec1d2854575b18ffb1'})
           @IsMongoId()
           @IsNotEmpty()
           productId : Types.ObjectId
       
           @ApiProperty({type : 'number' , example : 200})
           @IsOptional()
           amount : number
       
           @ApiProperty({type : 'number' , example :7})
           @IsOptional()
           days : number
}
