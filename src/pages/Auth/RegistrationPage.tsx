import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import axios from '../../axios';
import { Preloader, SnackbarCustom } from '../../components/index';
import { linkGithubAuth } from '../../constants';
import { fetchAuthRegister, selectIsAuth, UserResponse } from '../../redux/slices/auth';
import { useAppDispatch } from '../../redux/store';
import styles from './auth.module.scss';

export const RegistrationPage = () => {
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
      name: '',
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: UserResponse) => {
    setIsLoading(true);

    const data = await dispatch(fetchAuthRegister(values));

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
          <button onClick={handleClickGithubAuth} className="button button-github">
            Sign Up with GitHub
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
