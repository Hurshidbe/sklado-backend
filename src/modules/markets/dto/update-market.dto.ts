import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketDto } from './create-market.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateMarketDto extends PartialType(CreateMarketDto) {
        @IsOptional()
        @IsString()
        @Length(5,255)
        name? : string
    
        @IsOptional()
        @IsString()
        @Length(9,9)
        phone? : string
    
        @IsOptional()
        @Length(0,8)
        @IsString()
        password? : string
}
