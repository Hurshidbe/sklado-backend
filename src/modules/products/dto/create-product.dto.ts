import { IsNumber, IsString, Length, Max } from "class-validator";

export class CreateProductDto {
    @IsString()
    @Length(1,100)
    name : string

    @IsString()
    unit : string
}
