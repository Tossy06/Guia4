import { Injectable } from '@nestjs/common';

export interface Repartidor {
  id: string;
  nombre: string;
  ubicacion: { lat: number; lng: number } | string | null;
  activo: boolean;
}

@Injectable()
export class RepartidoresService {
  private repartidores: Repartidor[] = [
    { id: 'R01', nombre: 'Andrés Mora', ubicacion: { lat: 4.6097, lng: -74.0817 }, activo: true },
    { id: 'R02', nombre: 'Diana Castillo', ubicacion: { lat: 4.6492, lng: -74.0623 }, activo: true },
    { id: 'R03', nombre: 'Felipe Vargas', ubicacion: 'Calle 80 con Carrera 30', activo: true },
    { id: 'R04', nombre: 'Claudia Ríos', ubicacion: null, activo: false },
  ];

  findAll(): Repartidor[] {
    return this.repartidores;
  }

  findActivos(): Repartidor[] {
    return this.repartidores.filter(r => r.activo);
  }
}
