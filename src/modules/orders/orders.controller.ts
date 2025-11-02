import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Res, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import MarketGuard from 'src/guards/marketGuard';
import { Order } from './entities/order.entity';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

@UseGuards(MarketGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body : CreateOrderDto, @Req()req: any){
    try {
      return await this.ordersService.create(body, req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Get()
  async ownOrders(@Req() req : any){
    try {
      return await this.ordersService.findAllOwn(req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Get(':id')
  @ApiParam({
    name : 'id',
    required : true,
    description : 'get own order ById',
    example : '69078be8156fae69f2254ff3'
  })
  async getById(@Param('id') id : string , @Req() req : any){
    try {
      return await this.ordersService.findOne(id , req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Patch(':id')
  async update(
  @Param('id') id: string,
  @Body() body: CreateOrderDto,
  @Req() req: any,
) {
  try {
    return await this.ordersService.update(id, req.market.id, body);
  } catch (error) {
    throw new HttpException(error.message, error.status);
  }
}

@Delete(':id')
async remove(@Param('id') id: string, @Req() req: any) {
  try {
    return await this.ordersService.remove(id, req.market.id);
  } catch (error) {
    throw new HttpException(error.message, error.status);
  }
} 
}

