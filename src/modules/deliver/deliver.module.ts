import { Module } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { DeliverController } from './deliver.controller';
import { DeliverSeed } from 'src/modules/deliver/deliver.seed';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from './entities/deliver.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name : Deliver.name, schema : DeliverSchema}
    ])
  ],
  controllers: [DeliverController],
  providers: [DeliverService],
})
export class DeliverModule {}
