import { Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Market } from './entities/market.entity';
import { Model } from 'mongoose';

@Injectable()
export class MarketsService {
  constructor(@InjectModel(Market.name) private readonly MarketRepo : Model<Market>){}

  async create(createMarketDto: CreateMarketDto) {
    return await this.MarketRepo.create(createMarketDto);
  }

  async findAll() {
    return await this.MarketRepo.find()
  }

  async findOne(id: string) {
    return await this.MarketRepo.findById(id)
  }

  async update(id: string, updateMarketDto: UpdateMarketDto) {
    return await this.MarketRepo.findByIdAndUpdate(id, {...updateMarketDto}, {new : true})
  }

  async remove(id: string) {
    return await this.MarketRepo.deleteOne({_id:id},);
  }
}
