import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MarketsService } from './markets.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import AuthGuard from 'src/guards/authguard';

@UseGuards(AuthGuard)
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post()
  async create(@Body() createMarketDto: CreateMarketDto) {
    try {
      return await this.marketsService.create(createMarketDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.marketsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const market = await this.marketsService.findOne(id);
      if (!market) {
        throw new HttpException('Market not found', HttpStatus.NOT_FOUND);
      }
      return market;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    try {
      const updated = await this.marketsService.update(id, updateMarketDto);
      if (!updated) {
        throw new HttpException('Market not found', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.marketsService.remove(id);
      if (result.deletedCount === 0) {
        throw new HttpException('Market not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Market successfully deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
