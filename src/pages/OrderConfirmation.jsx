import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Card, Container, Divider, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { money } from '../data/catalog';
import { useStore } from '../lib/store';
import AppDownload from '../components/AppDownload';
import { useI18n } from '../i18n';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders } = useStore();
  const { t } = useI18n();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">{t('order.notFound')}</Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>{t('order.backHome')}</Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 72 }} />
          <Typography variant="h4" sx={{ mt: 1 }}>{t('order.thanks')}</Typography>
          <Typography color="text.secondary">{t('order.info', { id: order.id })}</Typography>
        </Box>
        <Card sx={{ p: 3, mt: 4 }}>
          {order.lines.map((l) => (
            <Stack key={l.id} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
              <Typography>{l.product.emoji} {l.qty} × {t(`products.${l.id}`)}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{money(l.product.price * l.qty)}</Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 1.5 }} />
          {order.discount > 0 && (
            <Stack direction="row" justifyContent="space-between"><Typography>{t('cart.discount', { code: order.couponCode })}</Typography><Typography>− {money(order.discount)}</Typography></Stack>
          )}
          <Stack direction="row" justifyContent="space-between"><Typography>{t('cart.shipping')}</Typography><Typography>{order.shipping ? money(order.shipping) : t('cart.free')}</Typography></Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="h6">{t('cart.total')}</Typography><Typography variant="h6">{money(order.total)}</Typography>
          </Stack>
        </Card>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button component={RouterLink} to="/" variant="contained">{t('order.keepShopping')}</Button>
        </Box>
      </Container>
      <AppDownload />
    </>
  );
}
