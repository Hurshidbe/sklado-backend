import { PartialType } from '@nestjs/mapped-types';
import { CreateProductLimitDto } from './create-product-limit.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class UpdateProductLimitDto extends PartialType(CreateProductLimitDto) {

           @IsOptional()
           @IsMongoId()
           marketId? : Types.ObjectId
    
           @IsOptional()
           @IsMongoId()
           productId? : Types.ObjectId
       
           @ApiProperty({type : 'number' , example : 200})
           @IsOptional()
           amount : number
       
           @ApiProperty({type : 'number' , example :7})
           @IsOptional()
           days : number
}
