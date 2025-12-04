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
import { ProductLimitService } from '../product-limit/product-limit.service';
import { Types } from 'mongoose';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderRepo: Model<Order>,
    @InjectModel(Product.name) private productRepo: Model<Product>,
    @InjectModel(Market.name) private marketRepo: Model<Market>,
    private readonly productLimitService : ProductLimitService
  ){}

 async create(body: CreateOrderDto, marketId: string) {
  await this.limitedCreate(marketId);

  for (const item of body.products) {
    const product = await this.productRepo.findById(item.productId);
    if (!product)
      throw new NotFoundException(`Product ${item.productId} not found`);

    await this.productLimitService.checkProductLimit(
      item.productId.toString(),
      marketId,
      item.quantity,
    );
  }

  const orderData = { ...body, marketId };

  const order = new this.orderRepo(orderData);
  return order.save();
}

async find(
  filter: { marketId?: string; status?: string; from?: string; to?: string },
  pageNum: number,
  limitNum: number
) {
  const query: any = {};
  if (filter.marketId) {
    try {
      query.marketId = new Types.ObjectId(filter.marketId);
    } catch (error) {
      throw new BadRequestException('Invalid marketId format');
    }
  }

  if (filter.status) query.status = filter.status;
  if (filter.from || filter.to) {
  query.createdAt = {};
  if (filter.from) query.createdAt.$gte = new Date(filter.from);
  if (filter.to)query.createdAt.$lte = new Date(filter.to); 
}

  const skip = (pageNum - 1) * limitNum;
  const orders = await this.orderRepo
    .find(query, '-__v')
    .sort({ createdAt: -1 })
    .populate('marketId', 'name phone')
    .populate('products.productId', 'name')
    .skip(skip)
    .limit(limitNum)
    .lean();

  if (!orders.length) {
    return {
      total: 0,
      page: pageNum,
      limit: limitNum,
      data: [],
    };
  }

  const total = await this.orderRepo.countDocuments(query);

  return {
    total,
    page: pageNum,
    limit: limitNum,
    data: orders,
  };
}



async findAllOwn(
  marketId: string,
  filter: { status?: 'new' | 'accepted' | 'rejected' | 'delivered' },
  pagination: { pageNum: number; limitNum: number }
) {
  const query: any = {};
  query.marketId = marketId;
  if (filter.status) query.status = filter.status;
  const skip = (pagination.pageNum - 1) * pagination.limitNum;
  const orders = await this.orderRepo
    .find(query, '-__v')
    .sort({createdAt : -1})
    .populate('products.productId', 'name')
    .skip(skip)
    .limit(pagination.limitNum)
    .lean();
  const total = await this.orderRepo.countDocuments(query);

  return {
    total,
    page: pagination.pageNum,
    limit: pagination.limitNum,
    data: orders,
  };
}


async findOne(id: string , marketId : string) {
    await this.isOwnOrder(id , marketId)
    return await this.orderRepo.findById(id);
  }

async update(orderId: string, marketId: string, updateData: CreateOrderDto) {
  await this.isOwnOrder(orderId, marketId);

  const order = await this.orderRepo.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');

  if (order.status !== 'new') {
    throw new BadRequestException(
      `your order already ${order.status}. you can not edit it`,
    );
  }
  for (const item of updateData.products) {
    const product = await this.productRepo.findById(item.productId);
    if (!product)
      throw new NotFoundException(`Product ${item.productId} not found`);

    await this.productLimitService.checkProductLimit(
      item.productId.toString(),
      marketId,
      item.quantity,
    );
  }
  const mergedProducts = this.mergeProducts(updateData.products);
  order.products = mergedProducts as any;

  await order.save();
  return order;
}

private mergeProducts(products: { productId: any; quantity: number }[]) {
  const map = new Map<string, { productId: any; quantity: number }>();

  for (const item of products) {
    const id = item.productId.toString();

    if (!map.has(id)) {
      map.set(id, { productId: item.productId, quantity: item.quantity });
    } else {
      const existing = map.get(id)!; 
      existing.quantity += item.quantity;
      map.set(id, existing);
    }
  }

  return Array.from(map.values());
}



async setAccepted(orderId : string){
  return await this.orderRepo.findByIdAndUpdate(orderId , {status : 'accepted'}, {new : true})
}

async setDelivered(orderId : string){
  return await this.orderRepo.findByIdAndUpdate(orderId , {status : 'delivered'}, {new : true})
} 

async setRejected(id : string){
  return await this.orderRepo.findByIdAndUpdate(id , {status : 'rejected'}, {new : true})
}

async removeMarketAllOrders(id: string){
  return await this.orderRepo.deleteMany({marketId : id})
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

async findoneProduct(id : string){
  return await this.productRepo.findById(id)
}

async findAllProducts(){
  return await this.productRepo.find().sort({createdAt : -1})
}

async findOwnProfile(markedId : string){
  return await this.marketRepo.findById(markedId).select('-password')
}
}
