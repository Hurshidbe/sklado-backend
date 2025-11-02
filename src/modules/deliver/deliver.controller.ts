import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, Query, Res } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import MarketGuard from 'src/guards/marketGuard';
import { OrdersService } from '../orders/orders.service';
import DeliverGuard from 'src/guards/deliverGuard';
import type { Response } from 'express';
import { OrderFilterDto } from '../orders/dto/create-order.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('deliver')
export class DeliverController {
  constructor(
    private readonly deliverService: DeliverService,
    private readonly orderService : OrdersService
  ) {}

  @UseGuards(DeliverGuard)
  @Get('orders/:id')
  @ApiParam({
    name : 'id',
    example : '69064cd9743a3140533cdf2f'
  })
  async getOrderById(@Param('id') id : string){
    try {
      return await this.deliverService.getOrderById(id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }


  @UseGuards(DeliverGuard)
  @Get('orders')
  async all(@Query() query : any){
    try {
      return await this.orderService.find(query)        
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/accept-order')
  @ApiParam({
    name : 'id',
    example : '69064cd9743a3140533cdf2f'
  })
  async acceptOrder(@Param('id') id : string){
    try {
      return await this.orderService.setAccepted(id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/delivered-order')
  @ApiParam({
    name : 'id',
    example : '69064cd9743a3140533cdf2f'
  })
  async deliveOrder(@Param('id') id : string){
    try {
      return await this.orderService.setDelivered(id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }
  @UseGuards(DeliverGuard)
  @Get('export')
  async exportOrders(
  @Res() res: Response,
  @Query() filter: OrderFilterDto) {
  const date = new Date().toISOString().slice(0, 10);
  const buffer = await this.deliverService.exportOrdersToExcel(filter);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=orders_${date}_status=${filter.status || "all"}.xlsx`,
  );

  res.end(buffer);
}
  // 5) full swagger
}
