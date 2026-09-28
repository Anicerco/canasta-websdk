// Catálogo de la demo (precios en MXN). Las imágenes son emojis sobre un fondo
// de color para no depender de archivos externos.
//
// Lo que se ve en el sitio (slugs de URL y textos) depende del idioma; lo que
// va a Singular es siempre en inglés: analyticsCategory() y analyticsName().
import en from '../i18n/en';

export const categories = [
  { slug: 'frutas-verduras', key: 'fruits_vegetables', name: 'Frutas y verduras', emoji: '🥑', color: '#E8F5E9' },
  { slug: 'despensa', key: 'pantry', name: 'Despensa', emoji: '🫙', color: '#FFF3E0' },
  { slug: 'lacteos', key: 'dairy_eggs', name: 'Lácteos y huevo', emoji: '🥛', color: '#E3F2FD' },
  { slug: 'panaderia', key: 'bakery', name: 'Panadería', emoji: '🥐', color: '#FBE9E7' },
  { slug: 'bebidas', key: 'beverages', name: 'Bebidas', emoji: '🧃', color: '#F3E5F5' },
  { slug: 'flores', key: 'flowers_gifts', name: 'Flores y regalos', emoji: '💐', color: '#FCE4EC' },
];

export const products = [
  { id: 'SKU-1001', name: 'Aguacate Hass (kg)', category: 'frutas-verduras', price: 69.9, emoji: '🥑', unit: 'kg' },
  { id: 'SKU-1002', name: 'Plátano (kg)', category: 'frutas-verduras', price: 24.5, emoji: '🍌', unit: 'kg' },
  { id: 'SKU-1003', name: 'Jitomate saladet (kg)', category: 'frutas-verduras', price: 32.0, emoji: '🍅', unit: 'kg' },
  { id: 'SKU-1004', name: 'Manzana roja (kg)', category: 'frutas-verduras', price: 49.9, emoji: '🍎', unit: 'kg' },
  { id: 'SKU-2001', name: 'Arroz súper extra 1 kg', category: 'despensa', price: 38.5, emoji: '🍚', unit: 'pza' },
  { id: 'SKU-2002', name: 'Frijol negro 900 g', category: 'despensa', price: 42.0, emoji: '🫘', unit: 'pza' },
  { id: 'SKU-2003', name: 'Aceite vegetal 1 L', category: 'despensa', price: 54.9, emoji: '🫗', unit: 'pza' },
  { id: 'SKU-3001', name: 'Leche entera 1 L', category: 'lacteos', price: 27.5, emoji: '🥛', unit: 'pza' },
  { id: 'SKU-3002', name: 'Huevo blanco 18 pzas', category: 'lacteos', price: 64.0, emoji: '🥚', unit: 'pza' },
  { id: 'SKU-3003', name: 'Queso panela 400 g', category: 'lacteos', price: 79.9, emoji: '🧀', unit: 'pza' },
  { id: 'SKU-4001', name: 'Conchas (paquete 4)', category: 'panaderia', price: 45.0, emoji: '🥐', unit: 'paq' },
  { id: 'SKU-4002', name: 'Pan de caja integral', category: 'panaderia', price: 52.5, emoji: '🍞', unit: 'pza' },
  { id: 'SKU-5001', name: 'Agua natural 1.5 L', category: 'bebidas', price: 15.0, emoji: '💧', unit: 'pza' },
  { id: 'SKU-5002', name: 'Jugo de naranja 1 L', category: 'bebidas', price: 36.9, emoji: '🧃', unit: 'pza' },
  { id: 'SKU-5003', name: 'Café molido 400 g', category: 'bebidas', price: 119.0, emoji: '☕', unit: 'pza' },
  { id: 'SKU-6001', name: 'Ramo de rosas rojas (12)', category: 'flores', price: 499.0, emoji: '🌹', unit: 'ramo' },
  { id: 'SKU-6002', name: 'Arreglo de girasoles', category: 'flores', price: 389.0, emoji: '🌻', unit: 'arreglo' },
  { id: 'SKU-6003', name: 'Caja de chocolates', category: 'flores', price: 229.0, emoji: '🍫', unit: 'caja' },
];

export const featuredIds = ['SKU-1001', 'SKU-6001', 'SKU-3002', 'SKU-5003', 'SKU-4001', 'SKU-6002', 'SKU-1004', 'SKU-2003'];

// Cupones de la demo. FLORES20 aplica solo a la categoría "flores".
export const coupons = {
  BIENVENIDA10: { type: 'percent', value: 10, label: '10% de descuento en tu compra' },
  FLORES20: { type: 'percent', value: 20, category: 'flores', label: '20% en flores y regalos' },
  ENVIOGRATIS: { type: 'shipping', label: 'Envío gratis' },
};

export const SHIPPING_COST = 49;
export const FREE_SHIPPING_FROM = 599;

export const findProduct = (id) => products.find((p) => p.id === id);
export const findCategory = (slug) => categories.find((c) => c.slug === slug);

// Valores para los atributos de Singular (siempre en inglés)
export const analyticsCategory = (slug) => findCategory(slug)?.key || slug;
export const analyticsName = (id) => en.products[id] || id;

export const money = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
