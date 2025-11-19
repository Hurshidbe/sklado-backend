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
import { Contact, ContactSchema } from '../contact/entities/contact.entity';
import { ContactService } from '../contact/contact.service';

@Module({
  imports : [
     OrdersModule,
     MongooseModule.forFeature([
       {name : Deliver.name , schema : DeliverSchema},
       {name : Order.name , schema : OrderSchema},
       {name : Market.name , schema : MarketSchema},
       {name : Product.name , schema : ProductSchema},
       {name : Contact.name, schema : ContactSchema}
     ])
   ],
  controllers: [DeliverController],
  providers: [DeliverService, MarketsService, ContactService],
})
export class DeliverModule {}
