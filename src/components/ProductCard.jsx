import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, IconButton, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { findCategory, money } from '../data/catalog';
import { useStore } from '../lib/store';
import { useI18n } from '../i18n';

export function ProductImage({ product, size = 150 }) {
  const { t } = useI18n();
  const color = findCategory(product.category)?.color || '#F0F3EE';
  return (
    <Box sx={{ height: size, display: 'grid', placeItems: 'center', bgcolor: color, borderRadius: 3, fontSize: size * 0.48 }}>
      <span role="img" aria-label={t(`products.${product.id}`)}>{product.emoji}</span>
    </Box>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist } = useStore();
  const { t } = useI18n();
  return (
    <Card sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <IconButton size="small" onClick={() => addToWishlist(product.id)} aria-label={t('product.addFavorite')} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, bgcolor: 'rgba(255,255,255,0.85)' }}>
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>
      <CardActionArea component={RouterLink} to={`/producto/${product.id}`} sx={{ borderRadius: 3 }}>
        <ProductImage product={product} />
        <Typography sx={{ mt: 1.5, fontWeight: 700, lineHeight: 1.3, minHeight: 42 }}>{t(`products.${product.id}`)}</Typography>
      </CardActionArea>
      <Box sx={{ flexGrow: 1 }} />
      <Typography sx={{ fontWeight: 900, fontSize: 20, mt: 1 }}>{money(product.price)}</Typography>
      <Button onClick={() => addToCart(product.id)} variant="contained" startIcon={<AddShoppingCartIcon />} sx={{ mt: 1 }} fullWidth>
        {t('product.add')}
      </Button>
    </Card>
  );
}
