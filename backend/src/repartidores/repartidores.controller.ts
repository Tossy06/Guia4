import { Controller, Get } from '@nestjs/common';
import { RepartidoresService } from './repartidores.service';

@Controller('repartidores')
export class RepartidoresController {
  constructor(private readonly service: RepartidoresService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('ubicaciones')
  ubicaciones() {
    return this.service.findActivos();
  }
}
