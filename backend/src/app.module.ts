import { Module } from '@nestjs/common';
import { PaquetesModule } from './paquetes/paquetes.module';
import { RepartidoresModule } from './repartidores/repartidores.module';

@Module({
  imports: [PaquetesModule, RepartidoresModule],
})
export class AppModule {}
