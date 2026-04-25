export class UpdatePaqueteDto {
  estado?: 'En bodega' | 'En ruta' | 'Entregado' | 'Incidencia';
  repartidorId?: string | null;
  ultimaUbicacion?: string | null;
}
