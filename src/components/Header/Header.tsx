import cn from 'classnames';
import { useState } from 'react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';

import styles from './header.module.scss';
import { LogoDesktop } from './logo/LogoDesktop';
import { LogoMobile } from './logo/LogoMobile';

const setActive = ({ isActive }: { isActive: boolean }): string => (isActive ? 'active-link' : '');
const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const [burger, setBurger] = useState(false);
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__inner}>
          <div className={styles.header__top}>
            <Link to="/">
              <LogoDesktop />
            </Link>
            <div onClick={() => setBurger(!burger)} className={styles.header__burger}>
              {burger ? <MdMenuOpen size={22} /> : <MdMenu size={22} />}
            </div>
            <nav
              className={burger ? cn(styles.nav, styles['nav-active']) : styles.nav}
              onClick={() => setBurger(false)}
            >
              <ul className={styles.nav__list} onClick={(e) => e.stopPropagation()}>
                <li className={styles.nav__item}>
                  <NavLink className={setActive} to="/">
                    Home
                  </NavLink>
                </li>
                <li className={styles.nav__item}>
                  <NavLink className={setActive} to="/workspace">
                    Posts
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className={styles.header__buttons}>
              <NavLink className={cn(styles.header__button, 'button')} style={setLoginButton} to="/account">
                Sign Up
              </NavLink>
              <NavLink className="button" style={setLoginButton} to="/login">
                Log In
              </NavLink>
            </div>
          </div>
          <div className={styles.header__bottom}>
            <form action="" className={styles.header__form}>
              <label className={styles['header__form-label']}>
                <svg className={styles['header__form-icon']} viewBox="0 0 56.7 56.7">
                  <path d="M42.8 7.3C33-2.4 17.1-2.4 7.3 7.3c-9.8 9.8-9.8 25.7 0 35.5 8.7 8.7 22.2 9.7 32 2.9l9.6 9.6c1.8 1.8 4.7 1.8 6.4 0 1.8-1.8 1.8-4.7 0-6.4l-9.6-9.6c6.8-9.8 5.8-23.3-2.9-32zm-6.2 29.3c-6.4 6.4-16.7 6.4-23.1 0s-6.4-16.7 0-23.1c6.4-6.4 16.7-6.4 23.1 0 6.4 6.4 6.4 16.8 0 23.1z"></path>
                </svg>
                <input className={styles.header__input} type="text" placeholder="Search CodePen..." />
              </label>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};
