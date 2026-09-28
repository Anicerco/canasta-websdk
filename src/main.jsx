import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { initSingularSDK } from './lib/singular';
import { readStoredSession, StoreProvider } from './lib/store';
import { detectLanguage, I18nProvider } from './i18n';
import App from './App';
import Home from './pages/Home';
import Category from './pages/Category';
import Product from './pages/Product';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';

// Step 2: inicializar una vez al cargar, antes de renderizar y de cualquier evento.
// (Este módulo corre con el DOM ya parseado, equivalente a DOMContentLoaded.)
const language = detectLanguage();
// ?lang= solo elige el idioma: se quita de la URL antes del init para que el
// SDK no lo copie a _web_params junto con los parámetros de campaña (utm / wp).
const url = new URL(window.location.href);
if (url.searchParams.has('lang')) {
  try {
    localStorage.setItem('canasta.lang', language); // el I18nProvider lo lee de acá
  } catch {
    // sin storage: el sitio usa el idioma del navegador
  }
  url.searchParams.delete('lang');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}
initSingularSDK({ customUserId: readStoredSession()?.userId, language });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="categoria/:slug" element={<Category />} />
              <Route path="producto/:id" element={<Product />} />
              <Route path="buscar" element={<Search />} />
              <Route path="carrito" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="pedido/:id" element={<OrderConfirmation />} />
              <Route path="cuenta" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);
