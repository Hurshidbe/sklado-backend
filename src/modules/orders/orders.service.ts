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
    await this.limitedCreate(marketId)
    body.marketId =marketId
    for(const item of body.products){
      const product = await this.productRepo.findById(item.productId)
      if(!product) throw new NotFoundException (`Product ${item.productId} not found`)
    }
    
    const order = new this.orderRepo(body);
    return order.save()
    }

  async findAll(filter: { market?: string; status?: string; from?: string; to?: string }) {
  const query: any = {};

  if (filter.market) query.marketId = filter.market;
  if (filter.status) query.status = filter.status;

  if (filter.from || filter.to) {
    query.createdAt = {};
    if (filter.from) query.createdAt.$gte = new Date(filter.from);
    if (filter.to) query.createdAt.$lte = new Date(filter.to);
  }

  const orders = await this.orderRepo
    .find(query, '-__v')
    .populate('marketId', 'name phone')
    .populate('products.productId', 'name')
    .lean();

  if (!orders.length) throw new NotFoundException('Orders not found');

  return orders;
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

async limitedCreate(marketId: string) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const orders = await this.orderRepo.find({ marketId : marketId, createdAt: { $gte: startOfToday }})
  if (orders.length !== 0) throw new BadRequestException('daily order creating limit reached')
  return true
}
}
