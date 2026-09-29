// Integración del Singular Web SDK (Native JavaScript), siguiendo la guía:
// https://support.singular.net/hc/en-us/articles/41863502734619
//
// Step 1  script del SDK en <head> (index.html)
// Step 2  initSingularSDK() una sola vez al cargar (manda el único __PAGE_VISIT__).
//         Para esta demo no se reporta pageVisit() en cada cambio de ruta de la SPA.
// Step 3  event / conversionEvent / revenue con nombres estándar (sng_*)
// Step 4  login(userId) / logout()
// Step 5  deduplicación de eventos del SDK + guarda propia para revenue
// Step 7  web-to-app con buildWebToAppLink / openApp
// Banners withBannersSupport + showBanner() una vez al cargar
import {
  SINGULAR_LOG_LEVEL,
  SINGULAR_PRODUCT_ID,
  SINGULAR_SDK_KEY,
  SINGULAR_SDK_SECRET,
} from '../config/singular';

const sdk = () => window.singularSdk;

// Registro de llamadas al SDK para el panel de debug de la demo.
const log = [];
const listeners = new Set();
function record(method, name, data) {
  const entry = { id: log.length + 1, time: new Date().toLocaleTimeString(), method, name, data };
  log.push(entry);
  listeners.forEach((fn) => fn([...log]));
}
export function subscribeSdkLog(fn) {
  listeners.add(fn);
  fn([...log]);
  return () => listeners.delete(fn);
}

export const sdkState = { initialized: false, singularDeviceId: null };

// Step 2 + Banners. Se llama una sola vez al cargar la app (main.jsx), antes
// de cualquier otro evento. Si el usuario ya tenía sesión, el CUID va en el
// config para que Singular lo tenga desde la primera sesión (Step 4).
export function initSingularSDK({ customUserId, language } = {}) {
  if (sdkState.initialized || !sdk()) return;

  const bannersOptions = new window.BannersOptions().withWebToAppSupport();
  let config = new window.SingularConfig(SINGULAR_SDK_KEY, SINGULAR_SDK_SECRET, SINGULAR_PRODUCT_ID)
    .withLogLevel(SINGULAR_LOG_LEVEL)
    // Global property: viaja en la primera sesión y en todos los eventos
    .withGlobalProperty('language', language || 'es', true)
    .withEventsDedupEnabled()
    .withTimeBetweenEvents(1000)
    .withBannersSupport(bannersOptions)
    .withInitFinishedCallback((initParams) => {
      sdkState.singularDeviceId = initParams.singularDeviceId;
      record('initFinished', 'singularDeviceId', { singularDeviceId: initParams.singularDeviceId });
    });
  if (customUserId) config = config.withCustomUserId(customUserId);

  sdk().init(config);
  sdkState.initialized = true;
  record('init', SINGULAR_PRODUCT_ID, customUserId ? { customUserId } : undefined);

  try {
    sdk().showBanner();
    record('showBanner', 'banner');
  } catch (e) {
    record('showBanner (error)', 'banner', { error: e.message });
  }
  watchBannerOffset();
}

// El banner de Singular se inserta como div#singular-banner con position:fixed
// arriba de todo, así que tapa el header. Mientras está visible, se publica su
// alto en --singular-banner-offset (index.html lo usa para bajar el contenido);
// si el usuario lo cierra, vuelve a 0.
function watchBannerOffset() {
  const root = document.documentElement;
  const update = () => {
    const el = document.getElementById('singular-banner');
    const visible = el && el.classList.contains('top') && getComputedStyle(el).display !== 'none';
    const offset = visible ? `${Math.round(el.getBoundingClientRect().height)}px` : '0px';
    if (root.style.getPropertyValue('--singular-banner-offset') !== offset) root.style.setProperty('--singular-banner-offset', offset);
  };
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', update);
  update();
}

// Cambio de idioma después del init: se actualiza la global property.
export function setLanguageProperty(language) {
  if (!sdkState.initialized) return;
  sdk().setGlobalProperties('language', language, true);
  record('setGlobalProperties', 'language', { language });
}

export function trackEvent(name, attributes) {
  if (!sdkState.initialized) return;
  sdk().event(name, attributes);
  record('event', name, attributes);
}

export function trackConversion(name, attributes) {
  if (!sdkState.initialized) return;
  sdk().conversionEvent(name, attributes);
  record('conversionEvent', name, attributes);
}

// Revenue con guarda por transaction id: aunque se recargue la página de
// confirmación, la misma orden no se reporta dos veces (Step 5).
export function trackRevenue(name, currency, amount, attributes) {
  if (!sdkState.initialized) return false;
  const key = `singular_revenue_${attributes?.sng_attr_transaction_id}`;
  try {
    if (sessionStorage.getItem(key)) {
      record('revenue (bloqueado: duplicado)', name, attributes);
      return false;
    }
    sessionStorage.setItem(key, '1');
  } catch {
    // sin storage: queda solo la deduplicación del SDK
  }
  sdk().revenue(name, currency, amount, attributes);
  record('revenue', name, { currency, amount, ...attributes });
  return true;
}

export function singularLogin(userId) {
  if (!sdkState.initialized) return;
  sdk().login(userId);
  record('login', userId);
}

export function singularLogout() {
  if (!sdkState.initialized) return;
  sdk().logout();
  record('logout', 'custom user id');
}

// Step 7: web-to-app. Sin SDK devuelve el link base.
export function buildWebToAppLink(baseLink, deeplink, passthrough, deferredDeeplink) {
  if (!sdkState.initialized) return baseLink;
  return sdk().buildWebToAppLink(baseLink, deeplink, passthrough, deferredDeeplink) || baseLink;
}

export function openApp(baseLink, deeplink, passthrough, deferredDeeplink) {
  if (!sdkState.initialized) {
    window.location.assign(baseLink);
    return;
  }
  record('openApp', baseLink, { deeplink, passthrough, deferredDeeplink });
  sdk().openApp(baseLink, deeplink, passthrough, deferredDeeplink);
}
