import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

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

export interface Repartidor {
  id: string;
  nombre: string;
  ubicacion: { lat: number; lng: number } | string | null;
  activo: boolean;
}

export const getPaquetes = () => api.get<Paquete[]>('/paquetes').then(r => r.data);
export const getPaquete = (id: string) => api.get<Paquete>(`/paquetes/${id}`).then(r => r.data);
export const createPaquete = (data: Omit<Paquete, 'estado' | 'repartidorId' | 'ultimaUbicacion' | 'ultimaActualizacion'>) =>
  api.post<Paquete>('/paquetes', data).then(r => r.data);
export const updatePaquete = (id: string, data: Partial<Pick<Paquete, 'estado' | 'repartidorId' | 'ultimaUbicacion'>>) =>
  api.put<Paquete>(`/paquetes/${id}`, data).then(r => r.data);
export const getRepartidores = () => api.get<Repartidor[]>('/repartidores').then(r => r.data);
export const getUbicaciones = () => api.get<Repartidor[]>('/repartidores/ubicaciones').then(r => r.data);
