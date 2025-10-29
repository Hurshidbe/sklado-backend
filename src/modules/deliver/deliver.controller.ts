import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
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
  @Get()
  async all(){
    try {
      return await this.orderService.findAll()        
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  // 1)add filter for orders (by date to date , status , by market ....)
}
