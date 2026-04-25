import { useState } from 'react';
import { createPaquete } from '../api/client';

const estadoInicial = {
  id: '',
  remitente: { nombre: '', telefono: '' },
  destinatario: { nombre: '', telefono: '', direccion: '' },
  paquete: { descripcion: '', dimensiones: '', peso: '' },
};

function generarGuia() {
  return `RR${1000 + Math.floor(Math.random() * 9000)}`;
}

export default function RegistrarPaquete() {
  const [form, setForm] = useState({ ...estadoInicial, id: generarGuia() });
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [cargando, setCargando] = useState(false);

  const set = (path: string, value: string) => {
    const [group, field] = path.split('.');
    if (field) {
      setForm(f => ({ ...f, [group]: { ...(f as any)[group], [field]: value } }));
    } else {
      setForm(f => ({ ...f, [path]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    try {
      const creado = await createPaquete(form);
      setMensaje({ tipo: 'ok', texto: `Paquete registrado con guía ${creado.id}` });
      setForm({ ...estadoInicial, id: generarGuia() });
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al registrar el paquete. Intente nuevamente.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page">
      <h1>Registrar Nuevo Paquete</h1>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <section>
          <h2>Número de Guía</h2>
          <div className="form-group">
            <label>Guía (auto-generada, editable)</label>
            <input value={form.id} onChange={e => set('id', e.target.value)} required />
          </div>
        </section>

        <section>
          <h2>Remitente</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input value={form.remitente.nombre} onChange={e => set('remitente.nombre', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Teléfono *</label>
              <input value={form.remitente.telefono} onChange={e => set('remitente.telefono', e.target.value)} required />
            </div>
          </div>
        </section>

        <section>
          <h2>Destinatario</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input value={form.destinatario.nombre} onChange={e => set('destinatario.nombre', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Teléfono *</label>
              <input value={form.destinatario.telefono} onChange={e => set('destinatario.telefono', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Dirección de entrega *</label>
            <input value={form.destinatario.direccion} onChange={e => set('destinatario.direccion', e.target.value)} required />
          </div>
        </section>

        <section>
          <h2>Datos del Paquete</h2>
          <div className="form-group">
            <label>Descripción *</label>
            <input value={form.paquete.descripcion} onChange={e => set('paquete.descripcion', e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Dimensiones (ej: 30x20x15 cm)</label>
              <input value={form.paquete.dimensiones} onChange={e => set('paquete.dimensiones', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Peso (ej: 2.5 kg)</label>
              <input value={form.paquete.peso} onChange={e => set('paquete.peso', e.target.value)} />
            </div>
          </div>
        </section>

        <div className="form-group">
          <label>Estado inicial</label>
          <input value="En bodega" disabled className="input-disabled" />
        </div>

        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar y Guardar'}
        </button>
      </form>
    </div>
  );
}
