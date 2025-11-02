import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, isEnum, IsNumber, IsString, Length, Max } from "class-validator";

export class CreateProductDto {
    @ApiProperty({type : 'string', example : 'gilos'})
    @IsString()
    @Length(1,100)
    name : string

    @ApiProperty({type : 'string' , enum :['piece', 'liter', 'kg', 'm' ] , default :'kg' })
    @IsString()
    @IsEnum(['piece', 'liter', 'kg', 'm' ])
    unit : string
}
