import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Res, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import MarketGuard from 'src/guards/marketGuard';
import { Order } from './entities/order.entity';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import DeliverGuard from 'src/guards/deliverGuard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(MarketGuard)
  @Post()
  async create(@Body() body : CreateOrderDto, @Req()req: any){
    try {
      return await this.ordersService.create(body, req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @UseGuards(DeliverGuard)
  @Get()
  async all(){
    try {
      return await this.ordersService.findAll()
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }
}
