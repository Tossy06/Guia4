# Repartos Rápidos SAS — Plataforma de Gestión Logística

> **Instrucciones para Claude Code**
> Proyecto: Sistema Integral de Logística — Ingeniería Web, UMB
> Equipo: Luis Olmedo Velasco, Natalia Beltran, Santiago Guerrero, David Gomez, Juan Quevedo Ovalle

---

## Contexto del Proyecto

Plataforma web para digitalizar la gestión de envíos de una empresa de mensajería. Permite registrar paquetes, administrar pedidos, asignar repartidores y ofrecer rastreo público a clientes.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React |
| Backend | NestJS (API REST) |
| Base de datos | MySQL |
| Formato de datos | JSON |

---

## Arquitectura

Arquitectura cliente-servidor de **tres capas**:

```
Frontend (React)
      ↕ HTTP / REST
Backend (NestJS)
      ↕ ORM / SQL
Base de datos (MySQL)
```

---

## Módulos del Sistema

### MOD-01 — Gestión de Paquetes
Registro inicial de envíos. Administra remitente, destinatario, dirección, dimensiones y número de guía.

**Componentes:** formulario de registro, base de datos de paquetes, validación de datos.

### MOD-02 — Gestión Operativa (Dashboard Admin)
Panel para el personal administrativo. Visualiza envíos en tabla, permite asignar repartidores y actualizar estados.

**Componentes:** dashboard, tabla de paquetes, acciones de asignación y actualización.

### MOD-03 — Monitoreo de Repartidores
Seguimiento de la flota activa con la ubicación actual o última reportada de cada repartidor.

**Componentes:** vista de mapa, consulta de ubicaciones, relación repartidor-paquete.

### MOD-04 — Rastreo Público
Portal sin autenticación para que el cliente consulte el estado de su envío por número de guía.

**Componentes:** página pública de consulta, búsqueda por guía, visualización de estado y ubicación.

---

## Modelo de Datos

### Entidad `Paquete`
```ts
{
  id: string,           // número de guía, ej: "RR1001" (auto-generado)
  remitente: {
    nombre: string,
    telefono: string,
  },
  destinatario: {
    nombre: string,
    telefono: string,
    direccion: string,
  },
  paquete: {
    descripcion: string,
    dimensiones: string,  // ej: "30x20x15 cm"
    peso: string,         // ej: "2.5 kg"
  },
  estado: "En bodega" | "En ruta" | "Entregado" | "Incidencia",
  repartidorId: string | null,
  ultimaUbicacion: string | null,
  ultimaActualizacion: datetime,
}
```

### Entidad `Repartidor`
```ts
{
  id: string,
  nombre: string,
  ubicacion: { lat: number, lng: number } | string | null,
  activo: boolean,
}
```

---

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/paquetes` | Crear nuevo paquete |
| `GET` | `/api/paquetes` | Listar todos los paquetes |
| `GET` | `/api/paquetes/:id` | Consultar paquete por número de guía |
| `PUT` | `/api/paquetes/:id` | Actualizar estado y/o repartidor asignado |
| `GET` | `/api/repartidores` | Listar repartidores |
| `GET` | `/api/repartidores/ubicaciones` | Obtener ubicaciones de repartidores activos |

---

## Requerimientos Funcionales

### RF-01 — Registrar nuevos paquetes
- **Prioridad:** Alta
- **Entradas:** número de guía, nombre/teléfono del remitente, nombre/teléfono del destinatario, dirección de entrega, descripción, dimensiones.
- **Proceso:** validar campos obligatorios y guardar con estado inicial `"En bodega"`.
- **Criterio de aceptación:** el paquete aparece en el dashboard con número de guía único.

### RF-02 — Visualizar paquetes en el dashboard admin
- **Prioridad:** Alta
- **Salida:** tabla con columnas: guía, remitente, destinatario, estado, repartidor asignado, última actualización.
- **Criterio de aceptación:** el administrador ve todos los paquetes actualizados.

### RF-03 — Asignar paquetes a repartidores
- **Prioridad:** Alta
- **Proceso:** el admin selecciona un paquete y elige un repartidor disponible.
- **Criterio de aceptación:** el cambio se refleja inmediatamente en el dashboard.

### RF-04 — Actualizar estado del envío
- **Prioridad:** Alta
- **Estados válidos:** `En bodega` → `En ruta` → `Entregado` / `Incidencia`
- **Criterio de aceptación:** el nuevo estado se refleja en la consulta pública.

### RF-05 — Consultar paquete por número de guía (admin)
- **Prioridad:** Alta
- **Proceso:** búsqueda exacta por número de guía.
- **Criterio de aceptación:** si existe, muestra info completa; si no, informa que no fue encontrado.

### RF-06 — Página pública de rastreo
- **Prioridad:** Alta
- **Proceso:** cliente ingresa número de guía sin necesidad de login.
- **Salida:** estado actual, destinatario, última actualización, referencia de ubicación.

### RF-07 — Mostrar última ubicación reportada
- **Prioridad:** Media
- **Proceso:** el sistema obtiene la última coordenada o referencia del repartidor asignado al paquete.
- **Criterio de aceptación:** visible al consultar un paquete asignado (mapa o texto).

### RF-08 — Ubicaciones de repartidores activos (panel admin)
- **Prioridad:** Media
- **Salida:** lista de repartidores con coordenadas geográficas actuales o última registrada.

---

## Historias de Usuario

| ID | Historia | Prioridad |
|---|---|---|
| HU-01 | Como administrador, quiero registrar un paquete para iniciar su seguimiento. | Alta |
| HU-02 | Como administrador, quiero ver todos los paquetes en un panel para controlar la operación diaria. | Alta |
| HU-03 | Como administrador, quiero asignar un paquete a un repartidor para organizar la entrega. | Alta |
| HU-04 | Como administrador, quiero actualizar el estado de un envío para reflejar el avance. | Alta |
| HU-05 | Como cliente, quiero consultar mi envío con el número de guía para saber su estado. | Alta |
| HU-06 | Como cliente, quiero ver la última ubicación reportada para mayor visibilidad. | Media |
| HU-07 | Como administrador, quiero ver la ubicación de los repartidores para monitorear la operación. | Media |

---

## Pantallas a Implementar

### 1. Formulario de Registro de Paquete (`/admin/registrar`)
Vista privada para empleados.

Campos requeridos:
- Número de guía (auto-generado, editable)
- Nombre y teléfono del remitente
- Nombre, teléfono y dirección del destinatario
- Descripción del paquete
- Dimensiones y peso
- Estado inicial (siempre `En bodega` por defecto)

Acción: botón **"Registrar y Guardar"** → `POST /api/paquetes`.

### 2. Dashboard Administrativo (`/admin/dashboard`)
Vista privada. Tabla principal con todos los paquetes.

Columnas: Guía | Remitente | Destinatario | Estado | Repartidor Asignado | Acciones

Acciones por fila:
- Ver detalle del paquete
- Asignar/cambiar repartidor (dropdown)
- Cambiar estado (dropdown: En bodega / En ruta / Entregado / Incidencia)
- Botón **"Asignar y Actualizar"** → `PUT /api/paquetes/:id`

### 3. Monitoreo de Flota (`/admin/monitoreo`)
Vista privada. Lista de repartidores activos + mapa.

Muestra por repartidor:
- Nombre
- Estado actual
- Última ubicación (coordenadas o dirección)
- Marcador en mapa

### 4. Rastreo Público (`/rastreo`)
Vista pública, sin autenticación.

Flujo:
1. Campo de texto para ingresar número de guía
2. Botón **"Rastrear"** → `GET /api/paquetes/:id`
3. Resultado muestra: estado del paquete, última actualización, última ubicación reportada, repartidor asignado (nombre)

---

## Notas de Implementación

- El número de guía se genera automáticamente con prefijo `RR` seguido de un número incremental (ej: `RR1001`).
- La autenticación del panel admin queda **fuera del MVP** — se puede proteger con una ruta simple o variable de entorno.
- Las ubicaciones de repartidores pueden ser coordenadas GPS o texto de referencia en la versión básica del MVP.
- Usar datos de prueba en memoria o seeds de MySQL para agilizar el desarrollo inicial.
- REST es suficiente para el MVP; no se requiere WebSocket en esta fase.
