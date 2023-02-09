import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { fetchAuth } from '../redux/slices/auth';

export const Login = () => {
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

  interface DefaultValues {
    identifier: string;
    password: string;
  }

  const onSubmit = (values: DefaultValues) => {
    console.log(values);
    dispatch(fetchAuth(values));
  };

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
              <span>{errors.login?.message}</span>
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
