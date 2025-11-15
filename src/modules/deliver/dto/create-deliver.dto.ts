import { IsString, Length, MaxLength } from "class-validator";

export class CreateDeliverDto {
    @IsString()
    @Length(2,20)
    name : string

    @MaxLength(9)
    @IsString()
    phone : string

    @IsString()
    @Length(4,16)
    password : string

    @IsString()
    @Length(4,16)
    return_password :string
}
