import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

@Controller('paquetes')
export class PaquetesController {
  constructor(private readonly service: PaquetesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePaqueteDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaqueteDto) {
    return this.service.update(id, dto);
  }
}
