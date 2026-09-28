import { useEffect, useState } from 'react';
import { Box, Chip, Divider, Drawer, Fab, IconButton, Stack, Typography } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import { SINGULAR_PRODUCT_ID } from '../config/singular';
import { sdkState, subscribeSdkLog } from '../lib/singular';
import { useStore } from '../lib/store';

const color = (method) =>
  method.startsWith('revenue') ? '#FF7A00' : method === 'conversionEvent' ? '#8E24AA' : method === 'event' ? '#1B7F3B' : '#607D8B';

// Panel para la demo: cada llamada al SDK (nombre y atributos), el Singular
// Device ID y el Custom User ID actual.
export default function SingularDebugPanel() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const { user } = useStore();
  useEffect(() => subscribeSdkLog(setEntries), []);

  return (
    <>
      <Fab variant="extended" size="medium" color="secondary" onClick={() => setOpen(true)} sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1200, color: '#fff' }}>
        <BugReportIcon sx={{ mr: 1 }} /> Singular ({entries.length})
      </Fab>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 460 }, p: 3 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Singular Web SDK · debug</Typography>
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ my: 2 }} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={sdkState.initialized ? 'SDK inicializado' : 'SDK no cargado'} color={sdkState.initialized ? 'success' : 'warning'} />
          <Chip size="small" label={user ? `CUID: ${user.userId}` : 'anónimo'} color={user ? 'primary' : 'default'} variant="outlined" />
        </Stack>
        <Typography variant="caption" color="text.secondary">Product ID: {SINGULAR_PRODUCT_ID}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all' }}>
          SDID: {sdkState.singularDeviceId || '—'}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Llamadas al SDK (más reciente arriba)</Typography>
        {[...entries].reverse().map((e) => (
          <Box key={e.id} sx={{ mb: 1.5, pl: 1.5, borderLeft: '3px solid', borderColor: color(e.method) }}>
            <Typography sx={{ fontFamily: 'monospace', fontSize: 13 }}>
              <b style={{ color: color(e.method) }}>{e.method}</b> {e.name} <span style={{ opacity: 0.5 }}>{e.time}</span>
            </Typography>
            {e.data && (
              <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: 11.5, m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'text.secondary' }}>
                {JSON.stringify(e.data, null, 1)}
              </Typography>
            )}
          </Box>
        ))}
      </Drawer>
    </>
  );
}
