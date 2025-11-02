import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Market, MarketSchema } from './entities/market.entity';

@Module({
  imports :[
    MongooseModule.forFeature([
      {name : Market.name , schema : MarketSchema}
    ])
  ],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
