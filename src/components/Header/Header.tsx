import cn from 'classnames';
import { useState } from 'react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import Media from 'react-media';
import { Link, NavLink } from 'react-router-dom';

import { ReactComponent as LogoDesktop } from '../../assets/svg/logoDesktop.svg';
import { ReactComponent as LogoMobile } from '../../assets/svg/LogoMobile.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import styles from './header.module.scss';
import { PenInfo } from './PenInfo/PenInfo';

// const setActive = ({ isActive }: { isActive: boolean }): string => (isActive ? 'active-link' : '');
const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const [burger, setBurger] = useState(false);
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
          <PenInfo />
          <form action="" className={styles.header__form}>
            <label className={styles['header__form-label']}>
              <Magnifier className={styles['header__form-icon']} />
              <input className={styles.header__input} type="text" placeholder="Search CodePen..." />
            </label>
          </form>
          <div className={styles.header__buttons}>
            <NavLink className={cn(styles.header__button, 'button')} style={setLoginButton} to="/account">
              Sign Up
            </NavLink>
            <NavLink className="button" style={setLoginButton} to="/login">
              Log In
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};
