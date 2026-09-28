import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import SingularDebugPanel from './components/SingularDebugPanel';
import { trackRouteChange } from './lib/singular';

export default function App() {
  const { pathname } = useLocation();
  const firstPath = useRef(pathname);

  // SPA: pageVisit() + hide/show del banner en cada ruta nueva, no en la
  // primera carga (esa visita la reporta init()).
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathname === firstPath.current) return;
    firstPath.current = null;
    trackRouteChange(pathname);
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
