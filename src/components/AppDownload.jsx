import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { APP_DEEPLINK, WEB_TO_APP_BASE_LINK } from '../config/singular';
import { buildWebToAppLink /* , openApp */ } from '../lib/singular';
import { useStore } from '../lib/store';
import { useI18n } from '../i18n';

// Step 7 de la guía: web-to-app.
// - Mobile: el CTA es un <a> real. Su href arranca con el link base y, en el
//   click, se reemplaza por buildWebToAppLink() (agrega _dl, _ddl, _p y los
//   parámetros de la campaña web: utm_* / wp*). Así en DevTools se ve cómo el
//   href del <a> se actualiza. Abre en otra pestaña para que la página quede
//   visible en la demo.
// - Escritorio: QR con el mismo link construido, para escanear con el celular.
// El passthrough (_p) va en JSON con el idioma y el user id si hay sesión.
export default function AppDownload() {
  const { user } = useStore();
  const { t, lang } = useI18n();
  const [qr, setQr] = useState(null);
  // passthrough (_p) en JSON, como indica la guía de Singular Links (el SDK lo
  // codifica para URL): idioma del sitio y user id si hay sesión.
  const passthrough = JSON.stringify({ source: 'canasta_web', lang, ...(user ? { uid: user.userId } : {}) });

  useEffect(() => {
    const link = buildWebToAppLink(WEB_TO_APP_BASE_LINK, APP_DEEPLINK, passthrough, APP_DEEPLINK);
    QRCode.toDataURL(link, { width: 180, margin: 1 }).then(setQr).catch(() => setQr(null));
  }, [passthrough]);

  // Se construye en el momento del click, con los parámetros web vigentes.
  // No hay preventDefault: navega el propio <a>, un click nativo del usuario
  // (lo que Android necesita para abrir la app por App Link).
  const onClick = (e) => {
    e.currentTarget.href = buildWebToAppLink(WEB_TO_APP_BASE_LINK, APP_DEEPLINK, passthrough, APP_DEEPLINK);

    // Alternativa con openApp(): arma el mismo link y lo abre con window.open.
    // Para usarla, descomentar el import de openApp y estas dos líneas:
    // e.preventDefault();
    // openApp(WEB_TO_APP_BASE_LINK, APP_DEEPLINK, passthrough, APP_DEEPLINK);
  };

  return (
    <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: { xs: 6, md: 8 }, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>{t('app.title')}</Typography>
            <Typography sx={{ opacity: 0.9, mt: 1, maxWidth: 520 }}>
              {t('app.text')}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                id="web-to-app-cta"
                component="a"
                href={WEB_TO_APP_BASE_LINK}
                target="_blank"
                rel="noopener"
                onClick={onClick}
                size="large"
                variant="contained"
                color="secondary"
                startIcon={<PhoneIphoneIcon />}
              >
                {t('app.cta')}
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center' }}>
            {qr && <Box component="img" src={qr} alt={t('app.qrAlt')} sx={{ width: 180, height: 180, bgcolor: '#fff', p: 1, borderRadius: 3 }} />}
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>{t('app.scan')}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
