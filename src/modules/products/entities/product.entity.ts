import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Product extends Document {
    @Prop({unique : true})
    name : string

    @Prop()
    price : number

    @Prop({enum :['piece', 'liter', 'kg']})
    unit : string
}

export const ProductSchema = SchemaFactory.createForClass(Product);
