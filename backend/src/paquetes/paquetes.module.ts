import { Module } from '@nestjs/common';
import { PaquetesController } from './paquetes.controller';
import { PaquetesService } from './paquetes.service';

@Module({
  controllers: [PaquetesController],
  providers: [PaquetesService],
})
export class PaquetesModule {}
