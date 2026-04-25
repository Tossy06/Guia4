export class CreatePaqueteDto {
  id?: string;
  remitente: {
    nombre: string;
    telefono: string;
  };
  destinatario: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
  paquete: {
    descripcion: string;
    dimensiones: string;
    peso: string;
  };
}
