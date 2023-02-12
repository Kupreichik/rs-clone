import cn from 'classnames';
import { useState } from 'react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import Media from 'react-media';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { ReactComponent as LogoDesktop } from '../../assets/svg/logoDesktop.svg';
import { ReactComponent as LogoMobile } from '../../assets/svg/logoMobile.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import { fetchAuthLogout, logout, selectIsAuth } from '../../redux/slices/auth';
import { RootState, useAppDispatch } from '../../redux/store';
import styles from './header.module.scss';

// const setActive = ({ isActive }: { isActive: boolean }): string => (isActive ? 'active-link' : '');
const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const [burger, setBurger] = useState(false);
  const dispatch = useAppDispatch();

  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await dispatch(fetchAuthLogout());
      dispatch(logout());
    }
  };

  const userAvatar = useSelector((state: RootState) => state.auth.data?.avatar);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__inner}>
          <Link to="/">
            <Media query={{ maxWidth: 700 }}>{(matches) => (matches ? <LogoMobile /> : <LogoDesktop />)}</Media>
          </Link>{' '}
          <div onClick={() => setBurger(!burger)} className={styles.header__burger}>
            {burger ? <MdMenuOpen size={22} /> : <MdMenu size={22} />}
          </div>
          <form action="" className={styles.header__form}>
            <label className={styles['header__form-label']}>
              <Magnifier className={styles['header__form-icon']} />
              <input className={styles.header__input} type="text" placeholder="Search CodePen..." />
            </label>
          </form>
          <div className={styles.header__buttons}>
            {isAuth ? (
              <>
                <img className={styles.header__avatar} src={userAvatar} alt="avatar" />
                <Link onClick={() => onClickLogout()} className="button" to="/">
                  Log Out
                </Link>
              </>
            ) : (
              <>
                <NavLink className={cn(styles.header__button, 'button')} style={setLoginButton} to="/register">
                  Sign Up
                </NavLink>
                <NavLink className="button" style={setLoginButton} to="/login">
                  Log In
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
