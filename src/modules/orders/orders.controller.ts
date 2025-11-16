import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Res, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import MarketGuard from 'src/guards/marketGuard';
import { Order } from './entities/order.entity';
import { Http2ServerRequest } from 'http2';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger';

@UseGuards(MarketGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({summary : 'buyurtma yaratish'})

  async create(@Body() body : CreateOrderDto, @Req()req: any){
    try {
      return await this.ordersService.create(body, req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Get()
  @ApiOperation({summary : "o'ziga tegishli barcha buyurtmalarni ko'rish"})
  async ownOrders(@Req() req : any){
    try {
      return await this.ordersService.findAllOwn(req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Get('products')
  @ApiOperation({summary : 'hamma productlarni olish(marketlar uchun)'})
  async productsList(){
    try {
      return await this.ordersService.findAllProducts()
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }


  @Get('products/:id')
  @ApiOperation({summary : 'Productni Id bo`yicha olish(marketlar uchun)'})
  @ApiParam({
      name : 'id',
      required : true,
      description : 'id bo`yicha productni olish',
      example : '690648a11d2854575b18ffa3'
    })
  async productById(@Param('id') id : string){
    try {
      return await this.ordersService.findoneProduct(id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Get(':id')
  @ApiOperation({summary : 'o`z buyurtmasini ko`rish'})
  @ApiParam({
    name : 'id',
    required : true,
    description : 'get own order ById',
    example : 'order_id'
  })
  async getById(@Param('id') id : string , @Req() req : any){
    try {
      return await this.ordersService.findOne(id , req.market.id)
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Patch(':id')
  @ApiOperation({summary : 'buyurtmani update qilish (while status="new")'})
  @ApiParam({
    name : 'id',
    required : true,
    example : 'order_id'
  })
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
@ApiOperation({summary : 'buyurtmani bekor qilish'})
@ApiParam({
  name : 'id',
  required : true,
  example : 'order_id'

})
async remove(@Param('id') id: string, @Req() req: any) {
  try {
    return await this.ordersService.remove(id, req.market.id);
  } catch (error) {
    throw new HttpException(error.message, error.status);
  }
} 
}



