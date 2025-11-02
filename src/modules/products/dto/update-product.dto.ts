import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString, Length, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
        @ApiProperty({type : 'string' , default : 'giloslar'})
        @IsOptional()
        @IsString()
        @Length(1,100)
        name? : string
    
        @ApiProperty({type : 'string' , enum :['piece', 'liter', 'kg', 'm' ] , default :'kg' })
        @IsOptional()
        @IsString()
        unit? : string
}
