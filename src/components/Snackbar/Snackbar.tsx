import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React, { forwardRef, SyntheticEvent } from 'react';

interface SnackbarComponentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ open, setOpen, message }) => {
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
      <Alert onClose={handleClose} severity="error" sx={{ width: 482 }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
