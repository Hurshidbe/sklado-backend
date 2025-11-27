import { Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Market } from './entities/market.entity';
import { Model } from 'mongoose';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class MarketsService {
  constructor(
    @InjectModel(Market.name) private readonly MarketRepo : Model<Market>,
    private readonly orderService : OrdersService
  ){}

  async create(createMarketDto: CreateMarketDto) {
    return await this.MarketRepo.create(createMarketDto);
  }

  async findAll() {
    return await this.MarketRepo.find().sort({createdAt : -1})
  }

  async findOne(id: string) {
    return await this.MarketRepo.findById(id)
  }

  async update(id: string, updateMarketDto: UpdateMarketDto) {
    return await this.MarketRepo.findByIdAndUpdate(id, {...updateMarketDto}, {new : true})
  }

  async remove(id: string) {
    await this.orderService.removeMarketAllOrders(id)
    return await this.MarketRepo.deleteOne({_id:id},);
  }
}
