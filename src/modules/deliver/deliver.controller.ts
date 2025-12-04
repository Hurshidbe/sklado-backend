import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, Query, Res, BadRequestException } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import MarketGuard from 'src/guards/marketGuard';
import { OrdersService } from '../orders/orders.service';
import DeliverGuard from 'src/guards/deliverGuard';
import type { Request, Response } from 'express';
import { OrderFilterDto } from '../orders/dto/create-order.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { ContactService } from '../contact/contact.service';
import { message } from 'telegraf/filters';
import { MessageDto } from '../contact/dto/create-contact.dto';

@Controller('deliver')
export class DeliverController {
  constructor(
    private readonly deliverService: DeliverService,
    private readonly orderService : OrdersService,
    private readonly contanctService : ContactService
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
      throw new HttpException(error.message , error.status||500)
    }
  }

  @UseGuards(DeliverGuard)
  @Get('own-profile')
  @ApiOperation({summary : 'deliver view profile'})
  async getOwnProfile(@Req() req : any){
    try {
      return await this.deliverService.getOwnProfile(req.user.id)
    } catch (error) {
      throw new HttpException(error.message , error.status||500)
    }
  }


@UseGuards(DeliverGuard)
@Get('orders')
@ApiOperation({
  summary: `Barcha buyurtmalar || query qabul qiladi`,
})
async all(
  @Query('marketId') marketId?: string,
  @Query('status') status?: 'new' | 'accepted' | 'rejected',
  @Query('from') from?: string,
  @Query('to') to?: string,
  @Query('page') page : string ='1' ,
  @Query('limit') limit : string ='10'

) {
  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  const filter: any = { marketId, status, from, to };
  return await this.orderService.find(filter, pageNum, limitNum);
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
      throw new HttpException(error.message , error.status||500)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/delivered-order')
  @ApiOperation({summary : 'buyurtma yetkazib berildi.'})
  @ApiParam({
    name : 'id',
    example : '69064cd9743a3140533cdf2f'
  })
  async deliveOrder(@Param('id') id : string){
    try {
      return await this.orderService.setDelivered(id)
    } catch (error) {
      throw new HttpException(error.message , error.status||500)
    }
  }

  @UseGuards(DeliverGuard)
  @Patch(':id/reject-order')
   @ApiOperation({summary : 'buyurtmani reject qilish(qabul qilmaslik)'})
  @ApiParam({
    name : 'id',
    example : '69064cd9743a3140533cdf2f'
  })
  async reject(@Param('id') id : string){
    try {
      return await this.orderService.setRejected(id)
    } catch (error) {
      throw new HttpException(error.message , error.status ||500)
    }
  }



  @UseGuards(DeliverGuard)
@Get('export')
@ApiOperation({
  summary: `Barcha buyurtmalarni chop etish (Excel shaklida yuklash) || query qabul qiladi`,
  description: 'query elements: (market?: marketId); (status?: new || accepted || rejected); (from?: Date); (to?: Date)',
})
async exportOrders(
  @Res() res: Response,
  @Query('marketId') marketId?: string,
  @Query('status') status?: 'new' | 'accepted' | 'rejected',
  @Query('from') from?: string,
  @Query('to') to?: string,
) {
  try {
  const filter: any = { marketId, status, from, to };
  const buffer = await this.deliverService.exportOrdersToExcel(filter);
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=orders_${date}_status=${status || "all"}.xlsx`,
  );
  res.end(buffer);
  } catch (error) {
    throw new HttpException(error.message , error.status ||500)
  }
}


@Post()
@ApiOperation({summary : 'yangi deliver qo`shish'})
async createNewDeliver(@Body() dto : CreateDeliverDto){
  try {
    return await this.deliverService.createDeliver(dto)
  } catch (error) {
    console.log(error)
    throw new BadRequestException(error.message , error.status||500)
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
    throw new HttpException(error.message , error.status||500)
  }
}

@UseGuards(DeliverGuard)
@Get('all-delivers')
@ApiOperation({summary : 'hamma deliverlarni ko`rish'})
async allDelivers(){
  try {
    return await this.deliverService.allDelivers()
  } catch (error) {
    throw new HttpException(error.meesage , error.status ||500)
  }
}

@UseGuards(DeliverGuard)
@Get(':id/deliver')
@ApiOperation({summary : 'deliverni idsi bo`yicha olish'})
@ApiParam({
  name : 'id',
  type : String,
  required : true
})
async getOneDeliver(
  @Param('id') id : string
){
  try {
    return await this.deliverService.deliversById(id)
  } catch (error) {
    throw new HttpException(error.message , error.status||500)
  }
}

@Get('chat/:id')
@ApiOperation({summary : 'marketfa tegishli chatni olib kelish'})
@ApiParam({
  name :'id',
  type : String,
  description : 'marketId',
  example : '6904da8156c4cca9dbccf758'
})
async MarketChat(
  @Param('id') marketId : string
){
  try {
    return await this.contanctService.findMarketChat(marketId)
  } catch (error) {
    console.log(error)
    throw new HttpException(error.meesage , error.status||500)
  }
}

@UseGuards(DeliverGuard)
@Post('send-message/:id')
@ApiOperation({summary : 'marketlarga marketId si orqali  message yuborish'})
async send(
  @Param('id') id : string,
  @Body() message : MessageDto
){
  try {
    return await this.contanctService.sendMessageToMarket( id, message )
  } catch (error) {
    throw new HttpException(error.message , error.status||500)
  }
}

@UseGuards(DeliverGuard)
@Get('messages')
@ApiOperation({summary : 'hamma messagelarni olib keladi'})
async allMessages(){
  try {
    return await this.contanctService.findAll()
  } catch (error) {
    throw new HttpException(error.meesage , error.status||500)
  }
}
}
