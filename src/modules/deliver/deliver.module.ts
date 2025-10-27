import { Module } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { DeliverController } from './deliver.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from './entities/deliver.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports : [
     MongooseModule.forFeature([
      {name : Deliver.name, schema : DeliverSchema}
    ])
  ],
  controllers: [DeliverController],
  providers: [DeliverService, ],
})
export class DeliverModule {}
