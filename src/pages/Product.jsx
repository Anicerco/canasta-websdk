import { useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Container, Grid, IconButton, Link, Snackbar, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { analyticsCategory, analyticsName, findCategory, findProduct, money, products } from '../data/catalog';
import { ProductImage } from '../components/ProductCard';
import ProductCard from '../components/ProductCard';
import { trackEvent } from '../lib/singular';
import { useStore } from '../lib/store';
import useTrackOnce from '../lib/useTrackOnce';
import { useI18n } from '../i18n';

export default function Product() {
  const { id } = useParams();
  const product = findProduct(id);
  const { addToCart, addToWishlist } = useStore();
  const { t } = useI18n();
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  // Vista de producto (estándar de e-commerce)
  useTrackOnce(product ? id : null, () =>
    trackEvent('sng_content_view', {
      sng_attr_content_type: analyticsCategory(product.category),
      sng_attr_content_id: product.id,
      sng_attr_content: analyticsName(product.id),
      sng_attr_item_price: product.price.toFixed(2),
    })
  );

  if (!product) return <Navigate to="/" replace />;
  const category = findCategory(product.category);
  const name = t(`products.${product.id}`);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">{t('product.home')}</Link>
        <Link component={RouterLink} to={`/categoria/${category.slug}`} underline="hover" color="inherit">{t(`categories.${category.slug}`)}</Link>
        <Typography color="text.primary">{name}</Typography>
      </Breadcrumbs>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImage product={product} size={360} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>{name}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>{t('product.per', { sku: product.id, unit: t(`units.${product.unit}`) })}</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 36, mt: 2 }}>{money(product.price)}</Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
            <IconButton onClick={() => setQty((q) => Math.max(1, q - 1))} sx={{ border: '1px solid #ddd' }} aria-label={t('product.less')}><RemoveIcon /></IconButton>
            <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 800, fontSize: 18 }}>{qty}</Typography>
            <IconButton onClick={() => setQty((q) => q + 1)} sx={{ border: '1px solid #ddd' }} aria-label={t('product.more')}><AddIcon /></IconButton>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button size="large" variant="contained" startIcon={<AddShoppingCartIcon />}
              onClick={() => { addToCart(product.id, qty); setToast(t('product.added', { qty, name })); }}>
              {t('product.addToCart')}
            </Button>
            <Button size="large" variant="outlined" startIcon={<FavoriteBorderIcon />}
              onClick={() => { addToWishlist(product.id); setToast(t('product.saved')); }}>
              {t('product.favorites')}
            </Button>
          </Stack>
          <Box sx={{ mt: 3, p: 2, bgcolor: '#F0F3EE', borderRadius: 3 }}>
            <Typography variant="body2">{t('product.delivery')}</Typography>
          </Box>
        </Grid>
      </Grid>
      {related.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>{t('product.related')}</Typography>
          <Grid container spacing={2}>
            {related.map((p) => (
              <Grid item xs={6} md={3} key={p.id}><ProductCard product={p} /></Grid>
            ))}
          </Grid>
        </>
      )}
      <Snackbar open={!!toast} autoHideDuration={2000} onClose={() => setToast(null)} message={toast} />
    </Container>
  );
}
