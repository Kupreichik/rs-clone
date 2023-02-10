import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { fetchAuth, selectIsAuth, UserData } from '../redux/slices/auth';

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      identifier: 'billy55',
      password: 'qwerty',
    },
  });

  const onSubmit = async (values: UserData) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) alert('Failed to log in');

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <section className="login">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Your Name or Email
            <input
              {...register('identifier', { required: 'Enter correct login' })}
              type="text"
              placeholder="Name or Email"
            />
            <div>
              <span>{errors.identifier?.message}</span>
            </div>
          </label>

          <label>
            Choose Password
            <input
              {...register('password', { required: 'Enter correct password' })}
              type="password"
              placeholder="Password"
            />
            <div>
              <span>{errors.password?.message}</span>
            </div>
          </label>

          <button type="submit">Log In</button>
        </form>
      </div>
    </section>
  );
};
