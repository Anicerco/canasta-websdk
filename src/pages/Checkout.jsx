import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Container, FormControlLabel, Grid, Radio, RadioGroup, Stack, Switch, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentsIcon from '@mui/icons-material/Payments';
import { OrderSummary } from './Cart';
import { useStore } from '../lib/store';
import useTrackOnce from '../lib/useTrackOnce';
import { useI18n } from '../i18n';

const METHODS = [
  { value: 'saved_card', icon: CreditCardIcon },
  { value: 'cash_in_store', icon: StorefrontIcon },
  { value: 'cash_on_delivery', icon: PaymentsIcon },
];

export default function Checkout() {
  const { user, totals, checkoutInitiated, addPaymentInfo, placeOrder } = useStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [method, setMethod] = useState(null);
  const [decline, setDecline] = useState(false);
  const [error, setError] = useState(null);

  // Inicio del checkout (estándar de e-commerce), solo con sesión y carrito
  useTrackOnce(user && totals.lines.length ? 'checkout' : null, checkoutInitiated);

  if (!user) return <Navigate to="/cuenta?next=/checkout" replace />;
  if (totals.lines.length === 0) return <Navigate to="/carrito" replace />;

  const choose = (value) => {
    setMethod(value);
    setError(null);
    addPaymentInfo(value);
  };

  const pay = () => {
    const result = placeOrder({ paymentMethod: method, simulateDecline: decline });
    if (!result.ok) {
      setError(t('checkout.declined'));
      return;
    }
    navigate(`/pedido/${result.order.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>{t('checkout.title')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">{t('checkout.delivery')}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>{t('checkout.deliveryWhen', { name: user.name })}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>{t('checkout.payment')}</Typography>
            <RadioGroup value={method} onChange={(e) => choose(e.target.value)}>
              {METHODS.map(({ value, icon: Icon }) => (
                <Card key={value} variant="outlined" sx={{ mb: 1, px: 2, boxShadow: 'none', borderColor: method === value ? 'primary.main' : undefined }}>
                  <FormControlLabel value={value} control={<Radio />} sx={{ width: '100%', py: 0.5 }}
                    label={<Stack direction="row" spacing={1} alignItems="center"><Icon color="action" /><span>{t(`checkout.methods.${value}`)}</span></Stack>} />
                </Card>
              ))}
            </RadioGroup>
            <FormControlLabel sx={{ mt: 1 }} control={<Switch checked={decline} onChange={(e) => setDecline(e.target.checked)} color="secondary" />}
              label={t('checkout.decline')} />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <OrderSummary>
            <Button fullWidth size="large" variant="contained" color="secondary" sx={{ mt: 3, color: '#fff' }} disabled={!method} onClick={pay}>
              {t('checkout.confirm')}
            </Button>
          </OrderSummary>
        </Grid>
      </Grid>
    </Container>
  );
}
