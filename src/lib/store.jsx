import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { analyticsCategory, analyticsName, coupons, findProduct, FREE_SHIPPING_FROM, SHIPPING_COST } from '../data/catalog';
import { CURRENCY } from '../config/singular';
import {
  singularLogin,
  singularLogout,
  trackConversion,
  trackEvent,
  trackRevenue,
} from './singular';

// Estado de la tienda (sesión, carrito, cupón, órdenes) persistido en
// localStorage. Cada acción reporta su evento estándar de Singular.
const KEYS = { session: 'canasta.session', cart: 'canasta.cart', coupon: 'canasta.coupon', orders: 'canasta.orders' };

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sin storage: el estado dura hasta recargar
  }
}

export function readStoredSession() {
  return load(KEYS.session, null);
}

// User ID opaco (hash), sin PII, como recomienda la guía (Step 4).
function toUserId(email) {
  let h = 0;
  for (const c of email.trim().toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `cu_${h.toString(16)}`;
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => load(KEYS.session, null));
  const [cart, setCart] = useState(() => load(KEYS.cart, []));
  const [couponCode, setCouponCode] = useState(() => load(KEYS.coupon, null));
  const [orders, setOrders] = useState(() => load(KEYS.orders, []));

  useEffect(() => save(KEYS.cart, cart), [cart]);
  useEffect(() => save(KEYS.coupon, couponCode), [couponCode]);
  useEffect(() => save(KEYS.orders, orders), [orders]);

  // ---- Cuenta -------------------------------------------------------------
  const register = useCallback((email, name) => {
    const next = { userId: toUserId(email), name };
    save(KEYS.session, next);
    setUser(next);
    // login() primero, así la conversión ya lleva el Custom User ID
    singularLogin(next.userId);
    trackConversion('sng_complete_registration', { sng_attr_registration_method: 'email' });
    return next;
  }, []);

  const login = useCallback((email) => {
    const next = { userId: toUserId(email), name: email.split('@')[0] };
    save(KEYS.session, next);
    setUser(next);
    singularLogin(next.userId);
    trackEvent('sng_login', { sng_attr_success: 'true' });
    return next;
  }, []);

  const logout = useCallback(() => {
    singularLogout();
    save(KEYS.session, null);
    setUser(null);
  }, []);

  // ---- Carrito ------------------------------------------------------------
  const addToCart = useCallback((productId, quantity = 1) => {
    const p = findProduct(productId);
    setCart((c) => {
      const found = c.find((i) => i.id === productId);
      return found ? c.map((i) => (i.id === productId ? { ...i, qty: i.qty + quantity } : i)) : [...c, { id: productId, qty: quantity }];
    });
    trackEvent('sng_add_to_cart', {
      sng_attr_content: analyticsName(p.id),
      sng_attr_content_type: analyticsCategory(p.category),
      sng_attr_content_id: p.id,
      sng_attr_quantity: String(quantity),
      sng_attr_item_price: p.price.toFixed(2),
    });
  }, []);

  const setQuantity = useCallback((productId, qty) => {
    setCart((c) => c.map((i) => (i.id === productId ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  // No hay evento estándar: custom "Remove from cart" de la guía, con prefijo sng_
  const removeFromCart = useCallback((productId) => {
    const p = findProduct(productId);
    setCart((c) => c.filter((i) => i.id !== productId));
    trackEvent('sng_remove_from_cart', {
      sng_attr_content: analyticsName(p.id),
      sng_attr_content_type: analyticsCategory(p.category),
      sng_attr_content_id: p.id,
    });
  }, []);

  const addToWishlist = useCallback((productId) => {
    const p = findProduct(productId);
    trackEvent('sng_add_to_wishlist', {
      sng_attr_content: analyticsName(p.id),
      sng_attr_content_type: analyticsCategory(p.category),
      sng_attr_content_id: p.id,
    });
  }, []);

  // ---- Cupón (custom "Coupon Applied" de la guía, con prefijo sng_) --------
  const applyCoupon = useCallback((raw) => {
    const code = raw.trim().toUpperCase();
    const valid = Boolean(coupons[code]);
    trackEvent('sng_coupon_applied', { sng_attr_coupon_code: code, sng_attr_valid: String(valid) });
    if (valid) setCouponCode(code);
    return valid;
  }, []);
  const removeCoupon = useCallback(() => setCouponCode(null), []);

  // ---- Totales ------------------------------------------------------------
  const totals = useMemo(() => {
    const lines = cart.map((i) => ({ ...i, product: findProduct(i.id) })).filter((l) => l.product);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const coupon = couponCode ? coupons[couponCode] : null;
    let discount = 0;
    if (coupon?.type === 'percent') {
      const base = coupon.category ? lines.filter((l) => l.product.category === coupon.category).reduce((s, l) => s + l.product.price * l.qty, 0) : subtotal;
      discount = (base * coupon.value) / 100;
    }
    const freeShipping = coupon?.type === 'shipping' || subtotal >= FREE_SHIPPING_FROM || lines.length === 0;
    const shipping = freeShipping ? 0 : SHIPPING_COST;
    const total = Math.max(0, subtotal - discount + shipping);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    return { lines, subtotal, discount, shipping, total, count, coupon };
  }, [cart, couponCode]);

  const contentList = useCallback(() => totals.lines.map((l) => l.id).join(','), [totals]);

  const viewCart = useCallback(() => {
    trackEvent('sng_view_cart', { sng_attr_content_list: contentList() });
  }, [contentList]);

  const checkoutInitiated = useCallback(() => {
    trackEvent('sng_checkout_initiated', {
      sng_attr_content_list: contentList(),
      sng_attr_payment_info_available: 'false',
      sng_attr_quantity: String(totals.count),
      sng_attr_item_price: totals.total.toFixed(2),
    });
  }, [contentList, totals]);

  // Solo atributos estándar: el medio de pago no tiene atributo sng_attr_*
  const addPaymentInfo = useCallback(() => {
    trackEvent('sng_add_payment_info', { sng_attr_success: 'true' });
  }, []);

  // Compra: revenue sng_ecommerce_purchase + custom sng_first_purchase / sng_payment_failure
  const placeOrder = useCallback(({ paymentMethod, simulateDecline }) => {
    if (simulateDecline) {
      trackEvent('sng_payment_failure', { sng_attr_success: 'false', sng_attr_item_price: totals.total.toFixed(2) });
      return { ok: false };
    }
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const isFirst = !orders.some((o) => o.userId === user?.userId);
    const attributes = {
      sng_attr_content_type: 'grocery',
      sng_attr_content_id: contentList(),
      sng_attr_content: totals.lines.map((l) => analyticsName(l.id)).join(', '),
      sng_attr_transaction_id: orderId,
      sng_attr_quantity: String(totals.count),
      ...(couponCode ? { sng_attr_coupon_code: couponCode } : {}),
    };
    trackRevenue('sng_ecommerce_purchase', CURRENCY, Number(totals.total.toFixed(2)), attributes);
    if (isFirst) trackEvent('sng_first_purchase', { sng_attr_transaction_id: orderId });

    const order = { id: orderId, userId: user?.userId, date: new Date().toISOString(), ...totals, couponCode, paymentMethod };
    setOrders((o) => [...o, order]);
    setCart([]);
    setCouponCode(null);
    return { ok: true, order };
  }, [contentList, couponCode, orders, totals, user]);

  const value = useMemo(
    () => ({
      user, register, login, logout,
      cart, totals, addToCart, setQuantity, removeFromCart, addToWishlist,
      couponCode, applyCoupon, removeCoupon,
      orders, viewCart, checkoutInitiated, addPaymentInfo, placeOrder,
    }),
    [user, register, login, logout, cart, totals, addToCart, setQuantity, removeFromCart, addToWishlist, couponCode, applyCoupon, removeCoupon, orders, viewCart, checkoutInitiated, addPaymentInfo, placeOrder]
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
