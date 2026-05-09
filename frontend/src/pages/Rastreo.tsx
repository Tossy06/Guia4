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

const FLUJO = ['En bodega', 'En ruta', 'Entregado'] as const;

const MENSAJE_ESTADO: Record<Paquete['estado'], string> = {
  'En bodega': 'Tu paquete ya fue registrado y está esperando despacho.',
  'En ruta': 'Tu paquete está en camino con nuestro equipo de reparto.',
  'Entregado': 'Tu paquete fue entregado correctamente.',
  'Incidencia': 'Hay una novedad con el envío. Nuestro equipo debe revisar el caso.',
};

export default function Rastreo() {
  const [guia, setGuia] = useState('');
  const [resultado, setResultado] = useState<Paquete | null>(null);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [error, setError] = useState('');
  const [buscando, setBuscando] = useState(false);

  const handleRastrear = async (e: React.FormEvent) => {
    e.preventDefault();
    const guiaNormalizada = guia.trim().toUpperCase();
    if (!guiaNormalizada) return;
    setBuscando(true);
    setError('');
    setResultado(null);
    try {
      const [paquete, rs] = await Promise.all([getPaquete(guiaNormalizada), getRepartidores()]);
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

  const clasePaso = (paso: typeof FLUJO[number], estado: Paquete['estado']) => {
    if (estado === 'Incidencia') return 'tracking-step warning';
    const actual = FLUJO.indexOf(estado as typeof FLUJO[number]);
    const indice = FLUJO.indexOf(paso);
    if (indice < actual) return 'tracking-step done';
    if (indice === actual) return 'tracking-step current';
    return 'tracking-step';
  };

  return (
    <div className="rastreo-page">
      <div className="rastreo-header">
        <span className="rastreo-pill">Portal público de rastreo</span>
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
              onChange={e => setGuia(e.target.value.toUpperCase())}
              placeholder="Ej: RR1001"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary" disabled={buscando}>
              {buscando ? 'Buscando...' : 'Rastrear'}
            </button>
          </div>
          <p className="rastreo-help">Puedes probar con RR1001, RR1002 o RR1003.</p>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {!resultado && !error && (
          <div className="rastreo-empty-state">
            <div>
              <strong>Seguimiento claro</strong>
              <span>Consulta el estado actual del paquete.</span>
            </div>
            <div>
              <strong>Datos de entrega</strong>
              <span>Revisa destinatario, contenido y ubicación.</span>
            </div>
            <div>
              <strong>Actualización operativa</strong>
              <span>Verifica la última fecha registrada.</span>
            </div>
          </div>
        )}

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

            <div className={`tracking-progress ${resultado.estado === 'Incidencia' ? 'tracking-warning' : ''}`}>
              {FLUJO.map(paso => (
                <div key={paso} className={clasePaso(paso, resultado.estado)}>
                  <span className="tracking-dot" />
                  <span>{paso}</span>
                </div>
              ))}
            </div>

            <div className={`estado-resumen ${BADGE[resultado.estado]}`}>
              <strong>{MENSAJE_ESTADO[resultado.estado]}</strong>
              {resultado.estado === 'Incidencia' && (
                <span>Si el estado no cambia pronto, contacta al equipo administrativo con la guía {resultado.id}.</span>
              )}
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
