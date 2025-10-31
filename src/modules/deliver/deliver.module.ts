import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { DeliverService } from './deliver.service';
import { DeliverController } from './deliver.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from './entities/deliver.entity';
import { JwtService } from '@nestjs/jwt';
import { Order, OrderSchema } from '../orders/entities/order.entity';
import { Market, MarketSchema } from '../markets/entities/market.entity';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { OrdersService } from '../orders/orders.service';
import { MarketsService } from '../markets/markets.service';

@Module({
  imports : [
     OrdersModule,
     MongooseModule.forFeature([
       {name : Order.name , schema : OrderSchema},
       {name : Market.name , schema : MarketSchema},
       {name : Product.name , schema : ProductSchema}
     ])
   ],
  controllers: [DeliverController],
  providers: [DeliverService, MarketsService],
})
export class DeliverModule {}
