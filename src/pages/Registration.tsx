import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { fetchAuthRegister, selectIsAuth } from '../redux/slices/auth';

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
    <section className="registration">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>Your Name</p>
          <input {...register('name', { required: 'Enter correct name' })} type="text" placeholder="Name" />{' '}
          <div>
            <span>{errors.name?.message}</span>
          </div>
          <p>Choose a username</p>
          <input
            {...register('username', { required: 'Enter correct username' })}
            type="text"
            placeholder="Username"
          />{' '}
          <div>
            <span>{errors.username?.message}</span>
          </div>
          <p>E-mail</p>
          <input {...register('email', { required: 'Enter correct e-mail' })} type="text" placeholder="E-mail" />{' '}
          <div>
            <span>{errors.email?.message}</span>
          </div>
          <p>Choose Password</p>
          <input
            {...register('password', { required: 'Enter correct password' })}
            type="password"
            placeholder="Password"
          />{' '}
          <div>
            <span>{errors.password?.message}</span>
          </div>
          <button type="submit" disabled={!isValid}>
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};
