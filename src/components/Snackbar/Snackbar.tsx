import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import React, { forwardRef, SyntheticEvent } from 'react';

interface SnackbarComponentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
  severity: AlertColor;
  customWidth: number;
}

export const SnackbarCustom: React.FC<SnackbarComponentProps> = ({
  open,
  setOpen,
  message,
  severity = 'error',
  customWidth = 482,
}) => {
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: customWidth }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
