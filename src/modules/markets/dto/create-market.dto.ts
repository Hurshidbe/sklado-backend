import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateMarketDto {
    @IsString()
    @Length(5,255)
    name : string

    @IsString()
    @Length(9,9)
    phone : string

    @Length(0,8)
    @IsString()
    password : string
}
