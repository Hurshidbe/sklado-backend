import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps  :true})
export class Deliver extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop()
  password : string

  @Prop()
  role : string
}

export const DeliverSchema = SchemaFactory.createForClass(Deliver);