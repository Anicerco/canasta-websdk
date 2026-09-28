import { useSearchParams } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';
import { products } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { trackEvent } from '../lib/singular';
import useTrackOnce from '../lib/useTrackOnce';
import { useI18n } from '../i18n';

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Search() {
  const [params] = useSearchParams();
  const { t } = useI18n();
  const q = params.get('q') || '';
  // Busca en el nombre del idioma actual y en el del catálogo
  const results = products.filter((p) => normalize(`${t(`products.${p.id}`)} ${p.name}`).includes(normalize(q)));

  // Búsqueda (estándar de e-commerce)
  useTrackOnce(q || null, () =>
    trackEvent('sng_search', { sng_attr_content_type: 'product', sng_attr_search_string: q })
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4">{t('search.title', { q })}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{t('search.count', { n: results.length })}</Typography>
      <Grid container spacing={2}>
        {results.map((p) => (
          <Grid item xs={6} sm={4} md={3} key={p.id}><ProductCard product={p} /></Grid>
        ))}
      </Grid>
    </Container>
  );
}
