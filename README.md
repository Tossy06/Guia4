# Repartos Rápidos SAS.

Sistema web fullstack para la gestión de paquetes y monitoreo de repartidores, desarrollado como Guía 4.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS · TypeScript · Node.js |
| Frontend | React 18 · TypeScript · Vite · React Router v6 |
| HTTP | Axios |

## Estructura del proyecto

```
Guia4/
├── backend/          # API REST con NestJS
│   └── src/
│       ├── paquetes/         # Módulo de paquetes
│       └── repartidores/     # Módulo de repartidores
└── frontend/         # SPA con React + Vite
    └── src/
        ├── api/              # Cliente HTTP (Axios)
        └── pages/
            ├── Dashboard.tsx       # Panel administrativo
            ├── Monitoreo.tsx       # Monitoreo de flota
            ├── RegistrarPaquete.tsx
            └── Rastreo.tsx         # Portal público
```

## Endpoints del Backend

**Base URL:** `http://localhost:3000/api`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/paquetes` | Listar todos los paquetes |
| `GET` | `/paquetes/:id` | Obtener paquete por guía |
| `POST` | `/paquetes` | Registrar nuevo paquete |
| `PUT` | `/paquetes/:id` | Actualizar estado/repartidor |
| `GET` | `/repartidores` | Listar repartidores |
| `GET` | `/repartidores/ubicaciones` | Repartidores activos con ubicación |

## Vistas del Frontend

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` o `/rastreo` | Portal Público | Rastreo de paquetes por guía |
| `/admin/registrar` | Registrar Paquete | Formulario de registro |
| `/admin/dashboard` | Dashboard | Gestión y actualización de paquetes |
| `/admin/monitoreo` | Monitoreo Flota | Ubicación en tiempo real de repartidores |

## Estados de un paquete

- **En bodega** — recibido, pendiente de despacho
- **En ruta** — asignado a un repartidor y en camino
- **Entregado** — entrega confirmada
- **Incidencia** — problema durante la entrega

## Instalación y uso

### 1. Instalar dependencias

```bash
npm run install:all
```

O de forma manual:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Ejecutar el backend

```bash
npm run backend
# → http://localhost:3000
```

### 3. Ejecutar el frontend

```bash
npm run frontend
# → http://localhost:5173
```

> El backend debe estar corriendo antes de iniciar el frontend.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
