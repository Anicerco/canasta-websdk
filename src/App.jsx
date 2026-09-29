import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import SingularDebugPanel from './components/SingularDebugPanel';

export default function App() {
  const { pathname } = useLocation();

  // Singular solo registra la visita de la carga inicial (init). En una SPA la
  // guía sugiere además pageVisit() en cada cambio de ruta; para esta demo no se
  // usa, así cada página muestra solo los eventos de negocio.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <SingularDebugPanel />
    </Box>
  );
}
