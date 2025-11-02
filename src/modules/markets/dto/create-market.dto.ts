import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateMarketDto {
    @ApiProperty({type : 'string', example : 'uzum-market'})
    @IsString()
    @Length(5,255)
    name : string

    @ApiProperty({type : 'string', example : '996666666'})
    @IsString()
    @Length(9,9)
    phone : string

    @ApiProperty({type : 'string', example : '1111'})
    @Length(0,8)
    @IsString()
    password : string
}
