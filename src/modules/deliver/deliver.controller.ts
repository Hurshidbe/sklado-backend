import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, Query } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import MarketGuard from 'src/guards/marketGuard';
import { OrdersService } from '../orders/orders.service';
import DeliverGuard from 'src/guards/deliverGuard';

@Controller('deliver')
export class DeliverController {
  constructor(
    private readonly deliverService: DeliverService,
    private readonly orderService : OrdersService
  ) {}

  @UseGuards(DeliverGuard)
  @Get('orders')
  async all(@Query() query : any){
    try {
      return await this.orderService.findAll(query)        
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/accept')
  async acceptOrder(@Param('id') id : string){
    try {
      return await this.orderService.setAccepted(id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/delivered')
  async deliveOrder(@Param('id') id : string){
    try {
      return await this.orderService.setDelivered(id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }
  
  
  
  // 2)status changes logics for orders many
  // 3) weekly limit for products
}
