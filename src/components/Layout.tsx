import '../styles/main.scss';
import '../styles/vars.scss';
import '../styles/form.scss';

import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { NotFoundPage } from '../pages/index';
import { getPensStatus } from '../redux/slices/pens';
import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';

export const Layout = () => {
  const status = useSelector(getPensStatus);

  return (
    <>
      <Header />
      <main className="main">
        <div className="container">{status === 'error' ? <NotFoundPage /> : <Outlet />}</div>
      </main>
      <Footer />
    </>
  );
};
