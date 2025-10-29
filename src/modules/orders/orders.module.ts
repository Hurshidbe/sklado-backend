import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; 
import { Market, MarketSchema } from '../markets/entities/market.entity'; 
import { Product, ProductSchema } from '../products/entities/product.entity'; 
import { Module } from '@nestjs/common';
import { Order, OrderSchema } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Order.name , schema : OrderSchema},
      {name : Market.name , schema : MarketSchema},
      {name : Product.name , schema : ProductSchema}
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
