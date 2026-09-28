import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { categories, featuredIds, findProduct } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import AppDownload from '../components/AppDownload';
import { useI18n } from '../i18n';

function Hero() {
  const { t } = useI18n();
  return (
    <Box sx={{ background: 'linear-gradient(120deg, #E6F4EA 0%, #FFF4E5 100%)', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip icon={<LocalOfferIcon />} label={t('home.chip')} color="secondary" sx={{ color: '#fff', fontWeight: 800, mb: 2 }} />
            <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 56 }, lineHeight: 1.05 }}>
              {t('home.titleA')}<Box component="span" sx={{ color: 'primary.main' }}>{t('home.titleB')}</Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, fontWeight: 600, maxWidth: 520 }}>
              {t('home.subtitle')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button size="large" variant="contained" component={RouterLink} to="/categoria/frutas-verduras">{t('home.start')}</Button>
              <Button size="large" variant="outlined" component={RouterLink} to="/cuenta">{t('home.createAccount')}</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ fontSize: 96, textAlign: 'center', lineHeight: 1.2 }}>🥑🍅🥖<br />🧀🌻🥛</Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Categories() {
  const { t } = useI18n();
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: 24, md: 30 } }}>{t('home.categories')}</Typography>
      <Grid container spacing={2}>
        {categories.map((c) => (
          <Grid item xs={4} md={2} key={c.slug}>
            <Card sx={{ bgcolor: c.color, boxShadow: 'none' }}>
              <CardActionArea component={RouterLink} to={`/categoria/${c.slug}`} sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ fontSize: 40 }}>{c.emoji}</Box>
                <Typography sx={{ fontWeight: 800, fontSize: 14, mt: 0.5 }}>{t(`categories.${c.slug}`)}</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function CouponBanner() {
  const { t } = useI18n();
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ borderRadius: 5, p: { xs: 3, md: 4 }, bgcolor: '#FFF1E0', border: '2px dashed', borderColor: 'secondary.main', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5">{t('home.couponTitle')}</Typography>
          <Typography color="text.secondary">{t('home.couponText', { a: 'ENVIOGRATIS', b: 'BIENVENIDA10' })}</Typography>
        </Box>
        <Chip label="FLORES20" sx={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 18, py: 2.5, px: 1, bgcolor: '#fff', border: '1px solid', borderColor: 'secondary.main' }} />
      </Box>
    </Container>
  );
}

export default function Home() {
  const { t } = useI18n();
  return (
    <>
      <Hero />
      <Categories />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: 24, md: 30 } }}>{t('home.featured')}</Typography>
        <Grid container spacing={2}>
          {featuredIds.map((id) => (
            <Grid item xs={6} sm={4} md={3} key={id}>
              <ProductCard product={findProduct(id)} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <CouponBanner />
      <AppDownload />
    </>
  );
}
