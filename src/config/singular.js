// Credenciales del Singular Web SDK (Native JavaScript).
// El SDK Key y el Secret de la web viajan al navegador por diseño; no son
// credenciales de servidor. El Product ID tiene que coincidir con el Bundle ID
// de la app web dada de alta en Singular (Apps page).
export const SINGULAR_SDK_KEY = 'se_demo_2f437a02';
export const SINGULAR_SDK_SECRET = 'e7cd35d2b614b4fd53ac7a8c28be3f8e';
export const SINGULAR_PRODUCT_ID = 'com.singularecommerce';

// 0 None · 1 Warn · 2 Info · 3 Debug (los requests se ven en la consola)
export const SINGULAR_LOG_LEVEL = 3;

// Link de Mobile Web-to-App (Singular Manage Links) para el QR de escritorio
// y el botón "Comprá desde la app".
export const WEB_TO_APP_BASE_LINK = 'https://sedemo.sng.link/Etb40/egye?_smtype=3';
// Pantalla de Canasta en la sample app Android (SE demo)
export const APP_DEEPLINK = 'singular-android://canasta';

export const CURRENCY = 'MXN';
