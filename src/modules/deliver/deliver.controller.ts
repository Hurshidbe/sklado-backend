import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, Query, Res, BadRequestException } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import MarketGuard from 'src/guards/marketGuard';
import { OrdersService } from '../orders/orders.service';
import DeliverGuard from 'src/guards/deliverGuard';
import type { Response } from 'express';
import { OrderFilterDto } from '../orders/dto/create-order.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('deliver')
export class DeliverController {
  constructor(
    private readonly deliverService: DeliverService,
    private readonly orderService : OrdersService
  ) {}

  @UseGuards(DeliverGuard)
  @Get('orders/:id')
  @ApiOperation({summary : 'buyurtmani ko`rish ById'})
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
  @ApiOperation({summary: `barcha buyurtmalar || query qabul qiladi`, description : 'query elements :(market?: marketId); (status?: new || accepted || rejected); (from?: Date); (to?: Date)'})
  async all(@Query() query : any){
    try {                                                  /// hurshidbe (utc problem)
      return await this.orderService.find(query)        
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/accept-order')
  @ApiOperation({summary : 'buyurtmani qabul qilish'})
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
  @ApiOperation({summary : 'buyurtmani qabul qilmaslik'})
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
  @ApiOperation({summary: `barcha buyurtmalarni chop etish (excel shaklida yuklash) || query qabul qiladi`, description : 'query elements :(market?: marketId); (status?: new || accepted || rejected); (from?: Date); (to?: Date)'})
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

@Post()
@ApiOperation({summary : 'yangi deliver qo`shish'})
async createNewDeliver(@Body() dto : CreateDeliverDto){
  try {
    return await this.deliverService.createDeliver(dto)
  } catch (error) {
    console.log(error)
    throw new BadRequestException(error.message , error.status)
  }
}

@Patch(':id')
@ApiOperation({summary : 'deliver ma`lumotlarini taxrirlash'})
@ApiParam({
  name : 'id',
  example : 'deliver_id'
})
async updateDeliverById(@Param('id') id : string, @Body() dto : UpdateDeliverDto){
  try {
    return await this.deliverService.updateDeliver(dto , id)
  } catch (error) {
    throw new HttpException(error.message , error.status)
  }
}
}
