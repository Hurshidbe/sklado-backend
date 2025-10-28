import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import MarketGuard from 'src/guards/marketGuard';
import { Order } from './entities/order.entity';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(MarketGuard)
  @Post()
  async create(@Body() body : CreateOrderDto){
    try {
      return await this.ordersService.create(body)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }
}
