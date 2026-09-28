import { Box, Container, Typography } from '@mui/material';
import { SINGULAR_PRODUCT_ID } from '../config/singular';
import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <Box component="footer" sx={{ bgcolor: '#14261A', color: 'rgba(255,255,255,0.75)', py: 5 }}>
      <Container maxWidth="lg">
        <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>🧺 canasta</Typography>
        <Typography variant="body2" sx={{ mt: 1, maxWidth: 560 }}>
          {t('footer.about')}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.6 }}>Product ID: {SINGULAR_PRODUCT_ID}</Typography>
      </Container>
    </Box>
  );
}
