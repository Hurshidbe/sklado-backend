import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, isMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateProductLimitDto {

    @ApiProperty({type : 'string' , example :'690648ec1d2854575b18ffb1'})
    @IsMongoId()
    @IsNotEmpty()
    productId : Types.ObjectId

    @ApiProperty({type : 'number' , example : 200})
    @IsNotEmpty()
    amount : number

    @ApiProperty({type : 'number' , example :7})
    @IsNotEmpty()
    days : number
}
