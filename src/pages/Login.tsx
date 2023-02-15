import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import Preloader from '../components/Preloader/Preloader';
import { fetchAuth, selectIsAuth, UserData } from '../redux/slices/auth';
import { useAppDispatch } from '../redux/store';
import styles from './auth.module.scss';

export const Login = () => {
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
      return alert('Failed to log in');
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  const handleClickGithubAuth = () => {
    setIsLoading(true);
    window.location.href =
      'https://github.com/login/oauth/authorize?client_id=c7a99918604b2ae5c655&redirect_uri=https://rs-clone-api.onrender.com/users/github-auth?path=/&scope=user:email';
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
        </div>
      </div>
    </section>
  );
};
