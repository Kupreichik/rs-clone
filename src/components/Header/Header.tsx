import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import cn from 'classnames';
import { useState } from 'react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { ReactComponent as LogoDesktop } from '../../assets/svg/logoDesktop.svg';
import { ReactComponent as LogoMobile } from '../../assets/svg/logoMobile.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import { fetchAuthLogout, logout, selectIsAuth } from '../../redux/slices/auth';
import { RootState, useAppDispatch } from '../../redux/store';
import styles from './header.module.scss';
import { PenInfo } from './PenInfo/PenInfo';

const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const [burger, setBurger] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleWindowResize);

  const onClickLogout = () => setOpen(true);

  const handleConfirmLogout = async () => {
    await dispatch(fetchAuthLogout());
    dispatch(logout());
    setOpen(false);
  };

  const userAvatar = useSelector((state: RootState) => state.auth.data?.avatar);
  const locationRouter = useLocation();

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__inner}>
          <Link to="/">{width > 700 && locationRouter.pathname !== '/editor' ? <LogoDesktop /> : <LogoMobile />}</Link>
          <div onClick={() => setBurger(!burger)} className={styles.header__burger}>
            {burger ? <MdMenuOpen size={22} /> : <MdMenu size={22} />}
          </div>
          {locationRouter.pathname === '/editor' && <PenInfo />}
          {locationRouter.pathname !== '/editor' && (
            <form className={styles.header__form}>
              <label className={styles['header__form-label']}>
                <Magnifier className={styles['header__form-icon']} />
                <input className={styles.header__input} type="text" placeholder="Search CodePen..." />
              </label>
            </form>
          )}
          <div className={styles.header__buttons}>
            {isAuth ? (
              <>
                <Link onClick={() => onClickLogout()} className="button" to="/">
                  Log Out
                </Link>
                <NavLink to="/profile">
                  <img className={styles.header__avatar} src={userAvatar} title="Profile" alt="avatar" />
                </NavLink>
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ style: { backgroundColor: '#1e1f26', color: 'white', paddingBottom: '20px' } }}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to Log Out?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ minWidth: '105px' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} sx={{ minWidth: '105px' }}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};
