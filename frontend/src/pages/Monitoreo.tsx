import { useEffect, useState } from 'react';
import { getUbicaciones, getPaquetes, Repartidor, Paquete } from '../api/client';

function formatUbicacion(u: Repartidor['ubicacion']): string {
  if (!u) return 'Sin ubicación registrada';
  if (typeof u === 'string') return u;
  return `Lat: ${u.lat.toFixed(4)}, Lng: ${u.lng.toFixed(4)}`;
}

export default function Monitoreo() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);

  useEffect(() => {
    Promise.all([getUbicaciones(), getPaquetes()]).then(([rs, ps]) => {
      setRepartidores(rs);
      setPaquetes(ps);
    });
  }, []);

  const paquetesDeRepartidor = (id: string) =>
    paquetes.filter(p => p.repartidorId === id && p.estado === 'En ruta');

  return (
    <div className="page">
      <h1>Monitoreo de Flota</h1>
      <p className="subtitle">Repartidores activos y su última ubicación reportada</p>

      <div className="mapa-placeholder">
        <div className="mapa-header">Mapa de repartidores activos</div>
        <div className="mapa-puntos">
          {repartidores.map(r => (
            <div key={r.id} className="mapa-punto">
              <div className="mapa-icono">📍</div>
              <div className="mapa-label">{r.nombre}</div>
              <div className="mapa-coords">{formatUbicacion(r.ubicacion)}</div>
            </div>
          ))}
        </div>
        <p className="mapa-nota">
          Nota: Integrar con Google Maps o Leaflet para visualización geográfica real.
        </p>
      </div>

      <div className="cards-grid">
        {repartidores.map(r => {
          const activos = paquetesDeRepartidor(r.id);
          return (
            <div key={r.id} className="card">
              <div className="card-header">
                <span className="driver-name">{r.nombre}</span>
                <span className={`badge ${r.activo ? 'badge-ruta' : 'badge-bodega'}`}>
                  {r.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">ID:</span>
                  <span>{r.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Última ubicación:</span>
                  <span>{formatUbicacion(r.ubicacion)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Paquetes en ruta:</span>
                  <span>{activos.length}</span>
                </div>
                {activos.length > 0 && (
                  <div className="paquetes-activos">
                    {activos.map(p => (
                      <span key={p.id} className="guia-tag">{p.id}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {repartidores.length === 0 && (
          <p className="empty">No hay repartidores activos.</p>
        )}
      </div>
    </div>
  );
}
