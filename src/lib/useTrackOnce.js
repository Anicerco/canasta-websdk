import { useEffect, useRef } from 'react';

// Ejecuta fn una sola vez por valor de key (por ejemplo, una vista de
// producto por id). El ref sobrevive al doble montaje de React StrictMode en
// desarrollo, así que la vista no se reporta dos veces.
export default function useTrackOnce(key, fn) {
  const sent = useRef(null);
  useEffect(() => {
    if (key == null || sent.current === key) return;
    sent.current = key;
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
