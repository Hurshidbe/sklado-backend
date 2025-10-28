import { IsString } from "class-validator";

export class LoginDeliverDto {
    @IsString()
    phone : string

    @IsString()
    password : string
}

export class LoginMarketDto {
    @IsString()
    phone : string

    @IsString()
    password : string
}