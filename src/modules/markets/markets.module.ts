import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Market, MarketSchema } from './entities/market.entity';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';
import { Order, OrderSchema } from '../orders/entities/order.entity';

@Module({
  imports :[
    MongooseModule.forFeature([
      {name : Market.name , schema : MarketSchema},
      
    ]),
    OrdersModule
  ],
  controllers: [MarketsController],
  providers: [MarketsService, ],
  exports: [MarketsService],
})
export class MarketsModule {}
