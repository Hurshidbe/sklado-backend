import { IsNumber, IsString, Length, Max } from "class-validator";

export class CreateProductDto {
    @IsString()
    @Length(1,100)
    name : string

    @IsNumber()
    @Max(999999999)
    price : number


    @IsString()
    unit : string
}
