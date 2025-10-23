import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';

@Controller('deliver')
export class DeliverController {
  constructor(private readonly deliverService: DeliverService) {}

  @Post()
  create(@Body() createDeliverDto: CreateDeliverDto) {
    return this.deliverService.create(createDeliverDto);
  }

  @Get()
  findAll() {
    return this.deliverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliverService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliverDto: UpdateDeliverDto) {
    return this.deliverService.update(+id, updateDeliverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliverService.remove(+id);
  }
}
