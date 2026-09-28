import { Navigate, useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';
import { analyticsCategory, findCategory, products } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { trackEvent } from '../lib/singular';
import useTrackOnce from '../lib/useTrackOnce';
import { useI18n } from '../i18n';

export default function Category() {
  const { slug } = useParams();
  const { t } = useI18n();
  const category = findCategory(slug);
  const items = products.filter((p) => p.category === slug);

  // Vista de una lista de productos (estándar de e-commerce)
  useTrackOnce(category ? slug : null, () =>
    trackEvent('sng_content_view_list', { sng_attr_content_list: items.map((p) => p.id).join(','), sng_attr_content_type: analyticsCategory(slug) })
  );

  if (!category) return <Navigate to="/" replace />;
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ bgcolor: category.color, borderRadius: 4, p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ fontSize: 48 }}>{category.emoji}</Box>
        <Box>
          <Typography variant="h4">{t(`categories.${slug}`)}</Typography>
          <Typography color="text.secondary">{t('category.count', { n: items.length })}</Typography>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {items.map((p) => (
          <Grid item xs={6} sm={4} md={3} key={p.id}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
