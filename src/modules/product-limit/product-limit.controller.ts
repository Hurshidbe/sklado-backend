import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { ProductLimitService } from './product-limit.service';
import { CreateProductLimitDto } from './dto/create-product-limit.dto';
import { UpdateProductLimitDto } from './dto/update-product-limit.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { Http2ServerRequest } from 'http2';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@UseGuards(DeliverGuard)
@Controller('product-limit')
export class ProductLimitController {
  constructor(private readonly productLimitService: ProductLimitService) {}

  @Post()
  @ApiOperation({summary : 'biror product uchun limit qo`yish( ex : 7 kun uchun 70kg )'})
  create(@Body() createProductLimitDto: CreateProductLimitDto) {
    try {
       return this.productLimitService.create(createProductLimitDto);
    } catch (error) {
       throw new HttpException(error.message , error.status)      
    }
  }

  @Get()
  @ApiOperation({summary : 'limiti bor barcha maxsulotlarni ko`rish'})
  findAll() {
    try {
      return this.productLimitService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get(':id')
  @ApiOperation({summary : "id bo'yicha ko'rish"})
  @ApiParam({
    name : 'id',
    example : '690792686619bf16a7be55b3'
  })
  findOne(@Param('id') id: string) {
    try {
      return this.productLimitService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message , error.status)    
    }
  }

  @Patch(':id')
  @ApiOperation({summary : 'limitni taxrirlash'})
  @ApiParam({
    name : 'id',
    example : '690792686619bf16a7be55b3'
  })
  update(@Param('id') id: string, @Body() updateProductLimitDto: UpdateProductLimitDto) {
    try {
      return this.productLimitService.update(id, updateProductLimitDto);
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }

  @Delete(':id')
  @ApiOperation({summary : "limitni o'chirish"})
  @ApiParam({
    name : 'id',
    example : '690792686619bf16a7be55b3'
  })
  remove(@Param('id') id: string) {
    try {
      return this.productLimitService.remove(id);
    } catch (error) {
      throw new HttpException(error.message , error.status)
    }
  }
}
