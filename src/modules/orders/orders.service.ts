import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Market } from '../markets/entities/market.entity';
import mongoose, { Model } from 'mongoose';
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

  async create(body: CreateOrderDto , marketId :string) {
    body.marketId =marketId
    for(const item of body.products){
      const product = await this.productRepo.findById(item.productId)
      if(!product) throw new NotFoundException (`Product ${item.productId} not found`)
    }
    
    const order = new this.orderRepo(body);
    return order.save()
    }

  async findAll() {
    try {
      return await this.orderRepo.find()
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  async findOne(id: string , marketId : string) {
    await this.isOwnOrder(id , marketId)
    return await this.orderRepo.findById(id);
  }

async update(orderId: string, marketId: string, updateData: CreateOrderDto) {
  await this.isOwnOrder(orderId , marketId)
  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'new')
    throw new BadRequestException(`your order already ${order.status}. you can not edit it` );

  order.products = updateData.products.map(item => ({
  productId: item.productId,
  quantity: item.quantity,
})) as any;
  await order.save();
  return order;
}


  // orders.service.ts
async remove(orderId: string, marketId: string) {
  await this.isOwnOrder(orderId, marketId);
  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'new')
    throw new BadRequestException(
      `Your order is already ${order.status}. You cannot delete it.`,
    );

  await this.orderRepo.findByIdAndDelete(orderId);
  return { message: 'Order deleted successfully' };
}


 async isOwnOrder(orderId: string, marketId: string): Promise<boolean> {
  const order = await this.orderRepo.findById(orderId);
  if (!order) return false;
  if (order.marketId?.toString() !== marketId.toString()) throw new BadRequestException('you can edit / see only your own orders');
  return true;
}


}
