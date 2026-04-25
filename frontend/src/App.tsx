import { Routes, Route, Link, useLocation } from 'react-router-dom';
import RegistrarPaquete from './pages/RegistrarPaquete';
import Dashboard from './pages/Dashboard';
import Monitoreo from './pages/Monitoreo';
import Rastreo from './pages/Rastreo';

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="app">
      {isAdmin && (
        <nav className="navbar">
          <div className="nav-brand">📦 Repartos Rápidos SAS</div>
          <div className="nav-links">
            <Link to="/admin/registrar" className={pathname === '/admin/registrar' ? 'active' : ''}>
              Registrar Paquete
            </Link>
            <Link to="/admin/dashboard" className={pathname === '/admin/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/admin/monitoreo" className={pathname === '/admin/monitoreo' ? 'active' : ''}>
              Monitoreo Flota
            </Link>
            <Link to="/rastreo" className="rastreo-link">
              Portal Público
            </Link>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Rastreo />} />
        <Route path="/rastreo" element={<Rastreo />} />
        <Route path="/admin/registrar" element={<RegistrarPaquete />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/monitoreo" element={<Monitoreo />} />
      </Routes>
    </div>
  );
}
