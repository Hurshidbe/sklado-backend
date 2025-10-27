import { IsString } from "class-validator";

export class LoginDeliverDto {
    @IsString()
    phone : string

    @IsString()
    password : string
}
