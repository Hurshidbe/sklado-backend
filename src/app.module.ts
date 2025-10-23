import { Module } from '@nestjs/common';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliverModule } from './modules/deliver/deliver.module';
import { ProductModule } from './modules/product/product.module';
import { DeliverSeed } from './modules/deliver/deliver.seed';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from './modules/deliver/entities/deliver.entity';
import * as dotenv from 'dotenv'
dotenv.config()

@Module({
  imports: [MongooseModule.forRoot(process.env.DB||""),DeliverModule,
     MongooseModule.forFeature([
          {name : Deliver.name, schema : DeliverSchema}
        ]),
     CustomersModule, ProductModule,],
  
  controllers: [],
  providers: [DeliverSeed],
})
export class AppModule {}
