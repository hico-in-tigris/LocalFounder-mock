import { React, MaterialUI } from '../shared/react.js';

const { useState, useEffect, useCallback } = React;
const { Snackbar, Alert } = MaterialUI;

export function useHashRouter(defaultRoute = '#/dashboard') {
  const [route, setRoute] = useState(() => window.location.hash || defaultRoute);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = defaultRoute;
    }
    const handler = () => setRoute(window.location.hash || defaultRoute);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [defaultRoute]);

  const navigate = useCallback((hash) => {
    window.location.hash = hash;
  }, []);

  return [route, navigate];
}

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        return stored;
      }
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    if (value === undefined) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function useNotifier() {
  const [snack, setSnack] = useState({ open: false, message: '' });

  const notify = useCallback((message) => setSnack({ open: true, message }), []);

  const snackbarElement = React.createElement(
    Snackbar,
    {
      open: snack.open,
      autoHideDuration: 4000,
      onClose: () => setSnack({ open: false, message: '' })
    },
    React.createElement(
      Alert,
      {
        severity: 'info',
        onClose: () => setSnack({ open: false, message: '' }),
        sx: { width: '100%' }
      },
      snack.message
    )
  );

  return { notify, snackbarElement };
}
