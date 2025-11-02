import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { ProductLimitService } from './product-limit.service';
import { CreateProductLimitDto } from './dto/create-product-limit.dto';
import { UpdateProductLimitDto } from './dto/update-product-limit.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { Http2ServerRequest } from 'http2';
import { ApiParam } from '@nestjs/swagger';

@UseGuards(DeliverGuard)
@Controller('product-limit')
export class ProductLimitController {
  constructor(private readonly productLimitService: ProductLimitService) {}

  @Post()
  create(@Body() createProductLimitDto: CreateProductLimitDto) {
    try {
       return this.productLimitService.create(createProductLimitDto);
    } catch (error) {
       throw new HttpException(error.message , error.status)      
    }
  }

  @Get()
  findAll() {
    try {
      return this.productLimitService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get(':id')
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
