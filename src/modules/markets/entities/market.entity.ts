import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Market extends Document {
    @Prop()
    name : string

    @Prop({unique :  true})
    phone : string

    @Prop()
    password : string
}

export const MarketSchema = SchemaFactory.createForClass(Market);
