import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Market } from '../markets/entities/market.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { error } from 'console';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderRepo: Model<Order>,
    @InjectModel(Product.name) private productRepo: Model<Product>,
    @InjectModel(Market.name) private marketRepo: Model<Market>,
  ){}

  async create(body: CreateOrderDto) {
    const market =await this.marketRepo.findById(body.marketId)
    if(!market) throw new NotFoundException('market not found')

    for(const item of body.products){
      const product = await this.productRepo.findById(item.productId)
      if(!product) throw new NotFoundException (`Product ${item.productId} not found`)
    }
    
    const order = new this.orderRepo(body);
    return order.save()
    }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
