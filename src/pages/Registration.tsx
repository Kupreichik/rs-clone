import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { fetchAuthRegister, selectIsAuth } from '../redux/slices/auth';
import styles from './auth.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: 'Eugene',
      username: 'Eugene',
      email: 'eugen@gmail.ru',
      password: '123456',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuthRegister(values));

    if (!data.payload) {
      return alert('Failed to register');
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

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
                required: 'Enter correct login',
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
            to="https://github.com/login/oauth/authorize?client_id=c7a99918604b2ae5c655&redirect_uri=http://localhost:3033/users/github-auth?path=/&scope=user:email"
            className="button button-github"
          >
            Sign Up with GitHub
          </Link>
        </div>
      </div>
    </section>
  );
};
