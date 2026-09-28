import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Client Hints para los Banners de Singular (guía de Banners, paso 2).
// En producción los mismos headers los pone vercel.json.
const clientHintsHeaders = {
  'Accept-CH': 'sec-ch-ua-model, sec-ch-ua-platform-version, sec-ch-ua-full-version-list',
  'Permissions-Policy':
    'ch-ua-model=("https://sdk-api-v1.singular.net"), ch-ua-platform-version=("https://sdk-api-v1.singular.net"), ch-ua-full-version-list=("https://sdk-api-v1.singular.net")',
};

export default defineConfig({
  plugins: [react()],
  server: { headers: clientHintsHeaders },
  preview: { headers: clientHintsHeaders },
});
