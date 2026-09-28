import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, Chip, Container, Divider, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FREE_SHIPPING_FROM, money } from '../data/catalog';
import { ProductImage } from '../components/ProductCard';
import { useStore } from '../lib/store';
import useTrackOnce from '../lib/useTrackOnce';
import { useI18n } from '../i18n';

export function OrderSummary({ children }) {
  const { totals, couponCode, removeCoupon } = useStore();
  const { t } = useI18n();
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{t('cart.summary')}</Typography>
      <Row label={t('cart.subtotal', { n: totals.count })} value={money(totals.subtotal)} />
      {totals.discount > 0 && <Row label={t('cart.discount', { code: couponCode })} value={`− ${money(totals.discount)}`} color="primary.main" />}
      <Row label={t('cart.shipping')} value={totals.shipping === 0 ? t('cart.free') : money(totals.shipping)} />
      {couponCode && (
        <Chip label={t('cart.couponChip', { code: couponCode, label: t(`coupons.${couponCode}`) })} onDelete={removeCoupon} color="primary" variant="outlined" size="small" sx={{ my: 1 }} />
      )}
      <Divider sx={{ my: 1.5 }} />
      <Row label={<b>{t('cart.total')}</b>} value={<b style={{ fontSize: 22 }}>{money(totals.total)}</b>} />
      {children}
    </Card>
  );
}

function Row({ label, value, color }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5, color }}>
      <Typography component="div">{label}</Typography>
      <Typography component="div" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Stack>
  );
}

function CouponField() {
  const { applyCoupon, couponCode } = useStore();
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const ok = applyCoupon(code);
    setResult({ ok, code: code.trim().toUpperCase() });
    if (ok) setCode('');
  };
  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
      <Stack direction="row" spacing={1}>
        <TextField size="small" label={t('cart.couponField')} value={code} onChange={(e) => setCode(e.target.value)} fullWidth disabled={!!couponCode} inputProps={{ style: { textTransform: 'uppercase' } }} />
        <Button type="submit" variant="outlined" disabled={!!couponCode}>{t('cart.apply')}</Button>
      </Stack>
      {result && (
        <Alert severity={result.ok ? 'success' : 'error'} sx={{ mt: 1 }}>
          {result.ok ? t('cart.couponOk', { code: result.code }) : t('cart.couponBad', { code: result.code })}
        </Alert>
      )}
      {!couponCode && <Typography variant="caption" color="text.secondary">{t('cart.couponHint')}</Typography>}
    </Box>
  );
}

export default function Cart() {
  const { totals, setQuantity, removeFromCart, viewCart } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();

  // Vista del carrito (estándar de e-commerce), solo si tiene productos
  useTrackOnce(totals.lines.length ? 'cart' : null, viewCart);

  if (totals.lines.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Box sx={{ fontSize: 72 }}>🧺</Box>
        <Typography variant="h4">{t('cart.empty')}</Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>{t('cart.goShop')}</Button>
      </Container>
    );
  }

  const missing = FREE_SHIPPING_FROM - totals.subtotal;
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>{t('cart.title')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {missing > 0 && <Alert severity="info" sx={{ mb: 2 }}>{t('cart.missing', { amount: money(missing) })}</Alert>}
          <Card sx={{ p: 2 }}>
            {totals.lines.map((l, i) => (
              <Box key={l.id}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
                  <Box sx={{ width: 72, flexShrink: 0 }}><ProductImage product={l.product} size={72} /></Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>{t(`products.${l.id}`)}</Typography>
                    <Typography variant="body2" color="text.secondary">{t('cart.each', { price: money(l.product.price) })}</Typography>
                  </Box>
                  <Stack direction="row" alignItems="center">
                    <IconButton size="small" onClick={() => setQuantity(l.id, l.qty - 1)} aria-label={t('product.less')}><RemoveIcon fontSize="small" /></IconButton>
                    <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 800 }}>{l.qty}</Typography>
                    <IconButton size="small" onClick={() => setQuantity(l.id, l.qty + 1)} aria-label={t('product.more')}><AddIcon fontSize="small" /></IconButton>
                  </Stack>
                  <Typography sx={{ fontWeight: 800, minWidth: 90, textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>{money(l.product.price * l.qty)}</Typography>
                  <IconButton onClick={() => removeFromCart(l.id)} aria-label={t('cart.remove')}><DeleteOutlineIcon /></IconButton>
                </Stack>
                {i < totals.lines.length - 1 && <Divider />}
              </Box>
            ))}
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <OrderSummary>
            <CouponField />
            <Button fullWidth size="large" variant="contained" color="secondary" sx={{ mt: 3, color: '#fff' }} onClick={() => navigate('/checkout')}>
              {t('cart.goPay')}
            </Button>
          </OrderSummary>
        </Grid>
      </Grid>
    </Container>
  );
}
