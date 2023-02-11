import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { fetchAuth, selectIsAuth, UserData } from '../redux/slices/auth';

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      identifier: 'billy55',
      password: 'qwerty',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: UserData) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Failed to log in');
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

          <button type="submit" disabled={!isValid}>
            Log In
          </button>
        </form>

        <a
          href="https://github.com/login/oauth/authorize?client_id=c7a99918604b2ae5c655&redirect_uri=http://localhost:3033/users/github-auth?path=/editor&scope=user:email"
          className="button"
          style={{ display: 'block', marginTop: '20px', width: '100px', background: 'green' }}
        >
          Github
        </a>
      </div>
    </section>
  );
};
