import { IsMongoId, isMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateProductLimitDto {

    @IsMongoId()
    @IsNotEmpty()
    productId : Types.ObjectId

    @IsNotEmpty()
    amount : number

    @IsNotEmpty()
    days : number
}
