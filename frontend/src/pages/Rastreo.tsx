import { useState } from 'react';
import { getPaquete, getRepartidores, Paquete, Repartidor } from '../api/client';
import { Link } from 'react-router-dom';

const BADGE: Record<string, string> = {
  'En bodega': 'badge-bodega',
  'En ruta': 'badge-ruta',
  'Entregado': 'badge-entregado',
  'Incidencia': 'badge-incidencia',
};

const ICONO: Record<string, string> = {
  'En bodega': '🏭',
  'En ruta': '🚚',
  'Entregado': '✅',
  'Incidencia': '⚠️',
};

export default function Rastreo() {
  const [guia, setGuia] = useState('');
  const [resultado, setResultado] = useState<Paquete | null>(null);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [error, setError] = useState('');
  const [buscando, setBuscando] = useState(false);

  const handleRastrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guia.trim()) return;
    setBuscando(true);
    setError('');
    setResultado(null);
    try {
      const [paquete, rs] = await Promise.all([getPaquete(guia.trim().toUpperCase()), getRepartidores()]);
      setResultado(paquete);
      setRepartidores(rs);
    } catch {
      setError(`No se encontró ningún envío con el número de guía "${guia.trim()}".`);
    } finally {
      setBuscando(false);
    }
  };

  const nombreRepartidor = (id: string | null) => {
    if (!id) return null;
    return repartidores.find(r => r.id === id)?.nombre || id;
  };

  return (
    <div className="rastreo-page">
      <div className="rastreo-header">
        <h1>📦 Repartos Rápidos SAS</h1>
        <p>Consulta el estado de tu envío en tiempo real</p>
        <Link to="/admin/dashboard" className="admin-link">Panel Administrativo →</Link>
      </div>

      <div className="rastreo-card">
        <form className="rastreo-form" onSubmit={handleRastrear}>
          <label htmlFor="guia">Número de guía</label>
          <div className="rastreo-input-group">
            <input
              id="guia"
              value={guia}
              onChange={e => setGuia(e.target.value)}
              placeholder="Ej: RR1001"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary" disabled={buscando}>
              {buscando ? 'Buscando...' : 'Rastrear'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {resultado && (
          <div className="resultado">
            <div className="resultado-header">
              <div>
                <div className="guia-grande">{resultado.id}</div>
                <div className="sub">Última actualización: {new Date(resultado.ultimaActualizacion).toLocaleString('es-CO')}</div>
              </div>
              <div className="estado-grande">
                <span className="estado-icono">{ICONO[resultado.estado]}</span>
                <span className={`badge badge-lg ${BADGE[resultado.estado]}`}>{resultado.estado}</span>
              </div>
            </div>

            <div className="resultado-grid">
              <div className="resultado-seccion">
                <h3>Destinatario</h3>
                <p>{resultado.destinatario.nombre}</p>
                <p>{resultado.destinatario.telefono}</p>
                <p>{resultado.destinatario.direccion}</p>
              </div>
              <div className="resultado-seccion">
                <h3>Contenido</h3>
                <p>{resultado.paquete.descripcion}</p>
                {resultado.paquete.dimensiones && <p>{resultado.paquete.dimensiones}</p>}
                {resultado.paquete.peso && <p>{resultado.paquete.peso}</p>}
              </div>
              {(resultado.repartidorId || resultado.ultimaUbicacion) && (
                <div className="resultado-seccion">
                  <h3>Seguimiento</h3>
                  {nombreRepartidor(resultado.repartidorId) && (
                    <p>Repartidor: <strong>{nombreRepartidor(resultado.repartidorId)}</strong></p>
                  )}
                  {resultado.ultimaUbicacion && (
                    <p>Última ubicación: <strong>{resultado.ultimaUbicacion}</strong></p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
