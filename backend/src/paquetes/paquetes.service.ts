import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { UpdatePaqueteDto } from './dto/update-paquete.dto';

export interface Paquete {
  id: string;
  remitente: { nombre: string; telefono: string };
  destinatario: { nombre: string; telefono: string; direccion: string };
  paquete: { descripcion: string; dimensiones: string; peso: string };
  estado: 'En bodega' | 'En ruta' | 'Entregado' | 'Incidencia';
  repartidorId: string | null;
  ultimaUbicacion: string | null;
  ultimaActualizacion: string;
}

@Injectable()
export class PaquetesService {
  private paquetes: Paquete[] = [
    {
      id: 'RR1001',
      remitente: { nombre: 'Carlos Pérez', telefono: '3001234567' },
      destinatario: { nombre: 'Ana López', telefono: '3109876543', direccion: 'Calle 45 # 12-30, Bogotá' },
      paquete: { descripcion: 'Laptop Dell', dimensiones: '40x30x10 cm', peso: '2.5 kg' },
      estado: 'En ruta',
      repartidorId: 'R01',
      ultimaUbicacion: 'Carrera 7 con Calle 50',
      ultimaActualizacion: new Date().toISOString(),
    },
    {
      id: 'RR1002',
      remitente: { nombre: 'María Torres', telefono: '3154445566' },
      destinatario: { nombre: 'Jorge Ruiz', telefono: '3201112233', direccion: 'Av. Caracas # 68-15, Bogotá' },
      paquete: { descripcion: 'Zapatos deportivos', dimensiones: '35x25x15 cm', peso: '1.2 kg' },
      estado: 'En bodega',
      repartidorId: null,
      ultimaUbicacion: null,
      ultimaActualizacion: new Date().toISOString(),
    },
    {
      id: 'RR1003',
      remitente: { nombre: 'Pedro Gómez', telefono: '3187778899' },
      destinatario: { nombre: 'Lucía Martínez', telefono: '3009990011', direccion: 'Calle 100 # 19-55, Bogotá' },
      paquete: { descripcion: 'Libros universitarios', dimensiones: '25x20x10 cm', peso: '3.0 kg' },
      estado: 'Entregado',
      repartidorId: 'R02',
      ultimaUbicacion: 'Destino final entregado',
      ultimaActualizacion: new Date().toISOString(),
    },
  ];

  private counter = 1004;

  private nextId(): string {
    return `RR${this.counter++}`;
  }

  findAll(): Paquete[] {
    return this.paquetes;
  }

  findOne(id: string): Paquete {
    const paquete = this.paquetes.find(p => p.id === id);
    if (!paquete) throw new NotFoundException(`Paquete ${id} no encontrado`);
    return paquete;
  }

  create(dto: CreatePaqueteDto): Paquete {
    const nuevo: Paquete = {
      id: dto.id || this.nextId(),
      remitente: dto.remitente,
      destinatario: dto.destinatario,
      paquete: dto.paquete,
      estado: 'En bodega',
      repartidorId: null,
      ultimaUbicacion: null,
      ultimaActualizacion: new Date().toISOString(),
    };
    this.paquetes.push(nuevo);
    return nuevo;
  }

  update(id: string, dto: UpdatePaqueteDto): Paquete {
    const paquete = this.findOne(id);
    if (dto.estado !== undefined) paquete.estado = dto.estado;
    if (dto.repartidorId !== undefined) paquete.repartidorId = dto.repartidorId;
    if (dto.ultimaUbicacion !== undefined) paquete.ultimaUbicacion = dto.ultimaUbicacion;
    paquete.ultimaActualizacion = new Date().toISOString();
    return paquete;
  }
}
