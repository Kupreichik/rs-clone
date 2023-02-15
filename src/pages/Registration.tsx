import { Button, Snackbar, TextField } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { forwardRef, SyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import axios from '../axios';
import { fetchAuthRegister, selectIsAuth, UserResponse } from '../redux/slices/auth';
import { useAppDispatch } from '../redux/store';
import styles from './auth.module.scss';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Registration = () => {
  const [open, setOpen] = useState(false);
  const isAuth = useSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: UserResponse) => {
    const data = await dispatch(fetchAuthRegister(values));

    if (!data.payload) {
      setOpen(true);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <section className={styles.auth}>
      <div className="container">
        <div className={styles.auth__inner}>
          <h1 className={styles.auth__title}>Sign Up</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.auth__form}>
            <TextField
              label="Your Name"
              error={Boolean(errors.name?.message)}
              helperText={errors.name?.message}
              {...register('name', {
                required: 'Enter your correct name',
                minLength: {
                  value: 3,
                  message: 'Minimum 3 symbols',
                },
              })}
              fullWidth
            />
            <TextField
              label="Choose a username"
              error={Boolean(errors.username?.message)}
              helperText={errors.username?.message}
              {...register('username', {
                required: 'Enter correct username',
                minLength: {
                  value: 3,
                  message: 'Minimum 3 symbols',
                },
                validate: async (value) => {
                  const { data } = await axios.get(`/users/username/${value}`);
                  return data.canUse || 'This name already taken!';
                },
              })}
              fullWidth
            />
            <TextField
              label="E-mail"
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Enter correct E-mail',
                pattern: {
                  value: /^[_a-z0-9-+-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i,
                  message: 'Enter correct E-mail',
                },
              })}
              fullWidth
            />
            <TextField
              type={'password'}
              label="Password"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Enter correct password',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 symbols',
                },
              })}
              fullWidth
            />
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
              Sign Up
            </Button>
          </form>
          <Link
            to="https://github.com/login/oauth/authorize?client_id=c7a99918604b2ae5c655&redirect_uri=https://rs-clone-api.onrender.com/users/github-auth?path=/&scope=user:email"
            className="button button-github"
          >
            Sign Up with GitHub
          </Link>

          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleClose} severity="error" sx={{ width: 482 }}>
              Failed to Sign Up!
            </Alert>
          </Snackbar>
        </div>
      </div>
    </section>
  );
};
