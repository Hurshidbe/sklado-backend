import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliverDto } from './create-deliver.dto';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateDeliverDto extends PartialType(CreateDeliverDto) {

        @IsOptional()
        @IsString()
        @Length(2,20)
        name? : string
    

        @MaxLength(9)
        @IsOptional()
        @IsString()
        phone? : string
    
        @IsOptional()
        @IsString()
        @Length(4,16)
        password? : string
    
        @IsOptional()
        @IsString()
        @Length(4,16)
        return_password? :string
}
