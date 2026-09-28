import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Card, Container, Divider, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { money } from '../data/catalog';
import { useStore } from '../lib/store';
import { useI18n } from '../i18n';

// Cuenta: registro (sng_complete_registration como conversión) y login (sng_login).
// En ambos casos se llama login(userId) del SDK antes del evento.
export default function Account() {
  const { user, register, login, logout, orders } = useStore();
  const { t } = useI18n();
  const [params] = useSearchParams();
  const next = params.get('next');
  const navigate = useNavigate();
  const [mode, setMode] = useState(next ? 'login' : 'register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (user) {
    const mine = orders.filter((o) => o.userId === user.userId);
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4">{t('account.hello', { name: user.name })}</Typography>
          <Typography color="text.secondary" sx={{ fontFamily: 'monospace', mt: 0.5 }}>{t('account.cuid', { id: user.userId })}</Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">{t('account.orders')}</Typography>
          {mine.length === 0 && <Typography color="text.secondary">{t('account.noOrders')}</Typography>}
          {mine.map((o) => (
            <Stack key={o.id} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
              <RouterLink to={`/pedido/${o.id}`}>{o.id}</RouterLink>
              <Typography>{money(o.total)}</Typography>
            </Stack>
          ))}
          <Button variant="outlined" color="inherit" sx={{ mt: 3 }} onClick={logout}>{t('account.logout')}</Button>
        </Card>
      </Container>
    );
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    if (mode === 'register') register(form.email, form.name || form.email.split('@')[0]);
    else login(form.email);
    navigate(next || '/');
  };

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4">{mode === 'register' ? t('account.registerTitle') : t('account.loginTitle')}</Typography>
        {next && <Alert severity="info" sx={{ mt: 2 }}>{t('account.loginToPay')}</Alert>}
        <Tabs value={mode} onChange={(_, v) => setMode(v)} variant="fullWidth" sx={{ mt: 2 }}>
          <Tab value="register" label={t('account.tabRegister')} sx={{ fontWeight: 800 }} />
          <Tab value="login" label={t('account.tabLogin')} sx={{ fontWeight: 800 }} />
        </Tabs>
        <Stack component="form" spacing={2} sx={{ mt: 3 }} onSubmit={submit}>
          {mode === 'register' && <TextField label={t('account.name')} value={form.name} onChange={set('name')} autoComplete="off" />}
          <TextField label={t('account.email')} type="email" value={form.email} onChange={set('email')} required autoComplete="off" />
          <TextField label={t('account.password')} type="password" value={form.password} onChange={set('password')} required autoComplete="new-password" />
          <Button type="submit" size="large" variant="contained">{mode === 'register' ? t('account.registerBtn') : t('account.loginBtn')}</Button>
        </Stack>
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('account.demoNote')}
        </Alert>
      </Card>
    </Container>
  );
}
