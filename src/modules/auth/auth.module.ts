import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deliver, DeliverSchema } from '../deliver/entities/deliver.entity';

@Module({
  imports : [
       MongooseModule.forFeature([
        {name : Deliver.name, schema : DeliverSchema}
      ])
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
