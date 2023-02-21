import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { Preloader, SnackbarCustom } from '../../components/index';
import { linkGithubAuth } from '../../constants';
import { fetchAuth, selectIsAuth, UserData } from '../../redux/slices/auth';
import { useAppDispatch } from '../../redux/store';
import styles from './Auth.module.scss';

export const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const isAuth = useSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: UserData) => {
    setIsLoading(true);

    const data = await dispatch(fetchAuth(values));

    setIsLoading(false);

    if (!data.payload) {
      setOpen(true);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  const handleClickGithubAuth = () => {
    setIsLoading(true);
    window.location.href = linkGithubAuth;
  };

  return isLoading ? (
    <Preloader />
  ) : (
    <section className={styles.auth}>
      <div className="container">
        <div className={styles.auth__inner}>
          <h1 className={styles.auth__title}>Log In</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.auth__form}>
            <TextField
              label="Username or E-Mail"
              error={Boolean(errors.identifier?.message)}
              helperText={errors.identifier?.message}
              {...register('identifier', {
                required: 'Enter correct login',
                minLength: {
                  value: 3,
                  message: 'Minimum 3 symbols',
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
              Log In
            </Button>
          </form>

          <button onClick={handleClickGithubAuth} className="button button-github">
            Log In with GitHub
          </button>
          <SnackbarCustom
            open={open}
            setOpen={setOpen}
            message="Failed to Log In!"
            severity="error"
            customWidth={250}
          />
        </div>
      </div>
    </section>
  );
};
