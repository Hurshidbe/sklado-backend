import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { ApiParam } from '@nestjs/swagger';

@UseGuards(DeliverGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiParam({
    name : 'id',
    example : '690797eefdec07bb92b752e2'
  })
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
    @ApiParam({
    name : 'id',
    example : '690797eefdec07bb92b752e2'
  })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const updated = await this.productsService.update(id, updateProductDto);
      if (!updated) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
    @ApiParam({
    name : 'id',
    example : '690797eefdec07bb92b752e2'
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.productsService.remove(id);
      if (result.deletedCount === 0) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Product successfully deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
