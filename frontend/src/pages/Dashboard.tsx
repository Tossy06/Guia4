import { useEffect, useState } from 'react';
import { getPaquetes, getRepartidores, updatePaquete, Paquete, Repartidor } from '../api/client';

const ESTADOS = ['En bodega', 'En ruta', 'Entregado', 'Incidencia'] as const;

const BADGE: Record<string, string> = {
  'En bodega': 'badge-bodega',
  'En ruta': 'badge-ruta',
  'Entregado': 'badge-entregado',
  'Incidencia': 'badge-incidencia',
};

export default function Dashboard() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [selEstado, setSelEstado] = useState<Record<string, string>>({});
  const [selRepartidor, setSelRepartidor] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<Paquete | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const [ps, rs] = await Promise.all([getPaquetes(), getRepartidores()]);
    setPaquetes(ps);
    setRepartidores(rs);
    const estados: Record<string, string> = {};
    const reps: Record<string, string> = {};
    ps.forEach(p => {
      estados[p.id] = p.estado;
      reps[p.id] = p.repartidorId || '';
    });
    setSelEstado(estados);
    setSelRepartidor(reps);
  };

  const handleActualizar = async (id: string) => {
    setGuardando(id);
    try {
      await updatePaquete(id, {
        estado: selEstado[id] as any,
        repartidorId: selRepartidor[id] || null,
      });
      await cargar();
    } finally {
      setGuardando(null);
    }
  };

  const filtrados = paquetes.filter(p =>
    p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.remitente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.destinatario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const resumen = [
    { etiqueta: 'Total', valor: paquetes.length, clase: 'stat-total', detalle: 'registrados' },
    ...ESTADOS.map(estado => ({
      etiqueta: estado,
      valor: paquetes.filter(p => p.estado === estado).length,
      clase: BADGE[estado],
      detalle: 'paquetes',
    })),
  ];

  const tieneCambiosPendientes = (p: Paquete) =>
    (selEstado[p.id] || p.estado) !== p.estado ||
    (selRepartidor[p.id] ?? (p.repartidorId || '')) !== (p.repartidorId || '');

  const nombreRepartidor = (id: string | null) => {
    if (!id) return '—';
    return repartidores.find(r => r.id === id)?.nombre || id;
  };

  return (
    <div className="page dashboard-page">
      <header className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">Panel operativo</span>
          <h1>Dashboard Administrativo</h1>
          <p>Gestiona envíos, asigna repartidores y mantén actualizados los estados de entrega.</p>
        </div>
        <div className="dashboard-highlight">
          <span>Incidencias</span>
          <strong>{paquetes.filter(p => p.estado === 'Incidencia').length}</strong>
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Resumen de paquetes">
        {resumen.map(item => (
          <article key={item.etiqueta} className={`dashboard-stat ${item.clase}`}>
            <span>{item.etiqueta}</span>
            <strong>{item.valor}</strong>
            <small>{item.detalle}</small>
          </article>
        ))}
      </section>

      <div className="dashboard-toolbar">
        <div className="dashboard-search">
          <input
            className="search-input"
            placeholder="Buscar por guía, remitente o destinatario..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setBusqueda('')}
            disabled={!busqueda}
          >
            Limpiar
          </button>
        </div>
        <span className="total-badge">{filtrados.length} de {paquetes.length} paquete(s)</span>
      </div>

      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal dashboard-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetalle(null)} aria-label="Cerrar detalle">✕</button>
            <div className="dashboard-modal-head">
              <div>
                <span className="sub">Detalle del envío</span>
                <h2>{detalle.id}</h2>
              </div>
              <span className={`badge badge-lg ${BADGE[detalle.estado]}`}>{detalle.estado}</span>
            </div>
            <table className="detail-table">
              <tbody>
                <tr><th>Remitente</th><td>{detalle.remitente.nombre} · {detalle.remitente.telefono}</td></tr>
                <tr><th>Destinatario</th><td>{detalle.destinatario.nombre} · {detalle.destinatario.telefono}</td></tr>
                <tr><th>Dirección</th><td>{detalle.destinatario.direccion}</td></tr>
                <tr><th>Descripción</th><td>{detalle.paquete.descripcion}</td></tr>
                <tr><th>Dimensiones</th><td>{detalle.paquete.dimensiones}</td></tr>
                <tr><th>Peso</th><td>{detalle.paquete.peso}</td></tr>
                <tr><th>Repartidor</th><td>{nombreRepartidor(detalle.repartidorId)}</td></tr>
                <tr><th>Última ubicación</th><td>{detalle.ultimaUbicacion || '—'}</td></tr>
                <tr><th>Última actualización</th><td>{new Date(detalle.ultimaActualizacion).toLocaleString('es-CO')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guía</th>
              <th>Remitente</th>
              <th>Destinatario</th>
              <th>Estado</th>
              <th>Repartidor</th>
              <th>Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td className="guia-cell">{p.id}</td>
                <td>{p.remitente.nombre}</td>
                <td>
                  <div>{p.destinatario.nombre}</div>
                  <div className="sub">{p.destinatario.direccion}</div>
                </td>
                <td>
                  <span className={`badge ${BADGE[p.estado]}`}>{p.estado}</span>
                </td>
                <td>{nombreRepartidor(p.repartidorId)}</td>
                <td className="sub">{new Date(p.ultimaActualizacion).toLocaleString('es-CO')}</td>
                <td className="actions-cell">
                  <button className="btn-secondary btn-sm" onClick={() => setDetalle(p)}>Ver</button>
                  <div className="dashboard-action-group">
                    <select
                      aria-label={`Estado de ${p.id}`}
                      value={selEstado[p.id] || p.estado}
                      onChange={e => setSelEstado(s => ({ ...s, [p.id]: e.target.value }))}
                    >
                      {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
                    </select>
                    <select
                      aria-label={`Repartidor de ${p.id}`}
                      value={selRepartidor[p.id] ?? (p.repartidorId || '')}
                      onChange={e => setSelRepartidor(s => ({ ...s, [p.id]: e.target.value }))}
                    >
                      <option value="">Sin asignar</option>
                      {repartidores.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                    </select>
                  </div>
                  <button
                    className={`btn-primary btn-sm ${tieneCambiosPendientes(p) ? '' : 'btn-muted'}`}
                    onClick={() => handleActualizar(p.id)}
                    disabled={guardando === p.id || !tieneCambiosPendientes(p)}
                  >
                    {guardando === p.id ? '...' : 'Guardar'}
                  </button>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={7} className="empty">No se encontraron paquetes.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
