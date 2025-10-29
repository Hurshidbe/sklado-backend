import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema({ timestamps :true})
export class Product extends Document {
    @Prop({unique : true})
    name : string

    @Prop({enum :['piece', 'liter', 'kg', 'm' ]})
    unit : string
}

export const ProductSchema = SchemaFactory.createForClass(Product);
