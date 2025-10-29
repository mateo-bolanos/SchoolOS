import { Alert, Snackbar } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useUiStore, { removeToast } from '../../store/uiStore';

const AUTO_HIDE_DURATION = 6000;

const ToastViewport = () => {
  const toasts = useUiStore((state) => state.toasts);
  const [activeId, setActiveId] = useState(null);

  const currentToast = useMemo(() => {
    if (!toasts.length) {
      return null;
    }

    if (activeId) {
      return toasts.find((toast) => toast.id === activeId) ?? toasts[0];
    }

    return toasts[0];
  }, [activeId, toasts]);

  useEffect(() => {
    if (toasts.length && (!activeId || !toasts.some((toast) => toast.id === activeId))) {
      setActiveId(toasts[0].id);
    }
  }, [activeId, toasts]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if (currentToast) {
      removeToast(currentToast.id);
    }

    setActiveId(null);
  };

  if (!currentToast) {
    return null;
  }

  return (
    <Snackbar
      key={currentToast.id}
      open
      autoHideDuration={AUTO_HIDE_DURATION}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert elevation={3} onClose={handleClose} severity={currentToast.severity} variant="filled">
        {currentToast.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastViewport;
