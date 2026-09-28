import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { LANGUAGES, useI18n } from '../i18n';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Badge, Box, Button, Container, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { categories, FREE_SHIPPING_FROM, money } from '../data/catalog';
import { useStore } from '../lib/store';

export function Logo({ color = 'primary.main' }) {
  return (
    <Typography component={RouterLink} to="/" sx={{ textDecoration: 'none', color, fontWeight: 900, fontSize: 26, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <span style={{ fontSize: 26 }}>🧺</span> canasta
    </Typography>
  );
}

function SearchBox() {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/buscar?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <Box component="form" onSubmit={submit} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', bgcolor: '#F0F3EE', borderRadius: 999, px: 2, py: 0.5, maxWidth: 560 }}>
      <SearchIcon sx={{ color: 'text.secondary' }} />
      <InputBase value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('header.search')} sx={{ ml: 1, flexGrow: 1 }} inputProps={{ 'aria-label': t('header.search') }} />
    </Box>
  );
}

function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Button color="inherit" startIcon={<LanguageIcon />} onClick={(e) => setAnchor(e.currentTarget)} aria-label={t('header.language')} sx={{ fontWeight: 800, minWidth: 0 }}>
        {lang.toUpperCase()}
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {LANGUAGES.map((l) => (
          <MenuItem key={l.code} selected={l.code === lang} onClick={() => { setLang(l.code); setAnchor(null); }}>
            <span style={{ marginRight: 8 }}>{l.flag}</span> {l.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function Header() {
  const { totals, user } = useStore();
  const { t } = useI18n();
  return (
    <>
      <Box sx={{ bgcolor: 'primary.dark', color: '#fff', py: 0.75, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
        <LocalShippingIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }} />
        {t('header.promo', { amount: money(FREE_SHIPPING_FROM), code: 'BIENVENIDA10' })}
      </Box>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', color: 'text.primary', borderBottom: '1px solid', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, py: { xs: 1, md: 0 } }}>
            <Logo />
            <Box sx={{ order: { xs: 3, md: 0 }, width: { xs: '100%', md: 'auto' }, flexGrow: 1, display: 'flex' }}>
              <SearchBox />
            </Box>
            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
            <LanguageSelector />
            <Button component={RouterLink} to="/cuenta" color="inherit" startIcon={<PersonIcon />} sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {user ? user.name : t('header.login')}
            </Button>
            <IconButton component={RouterLink} to="/carrito" aria-label={t('header.cart')} sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
              <Badge badgeContent={totals.count} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
          <Box sx={{ display: 'flex', gap: 0.5, overflowX: 'auto', pb: 1, scrollbarWidth: 'none' }}>
            {categories.map((c) => (
              <Button key={c.slug} component={NavLink} to={`/categoria/${c.slug}`} size="small" color="inherit"
                sx={{ whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 700, color: 'text.secondary', '&.active': { color: 'primary.main', bgcolor: 'rgba(27,127,59,0.08)' } }}>
                {c.emoji} {t(`categories.${c.slug}`)}
              </Button>
            ))}
          </Box>
        </Container>
      </AppBar>
    </>
  );
}
