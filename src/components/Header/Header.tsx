import cn from 'classnames';
import { useState } from 'react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/svg/logo.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import styles from './header.module.scss';

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
              <Logo />
            </Link>
            <div onClick={() => setBurger(!burger)} className={styles.header__burger}>
              {burger ? <MdMenuOpen size={22} /> : <MdMenu size={22} />}
            </div>
            <nav
              className={burger ? cn(styles.nav, styles['nav-active']) : styles.nav}
              onClick={() => setBurger(false)}
            >
              <ul
                className={styles.nav__list}
                onClick={(e) => {
                  e.stopPropagation();
                  setBurger(false);
                }}
              >
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
                <Magnifier className={styles['header__form-icon']} />
                <input className={styles.header__input} type="text" placeholder="Search CodePen..." />
              </label>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};
