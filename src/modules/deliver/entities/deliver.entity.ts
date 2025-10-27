import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Deliver extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  password : string
}

export const DeliverSchema = SchemaFactory.createForClass(Deliver);