import '../../styles/menu.scss';

import { ExitToApp, Person, Work } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import cn from 'classnames';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { ReactComponent as LogoDesktop } from '../../assets/svg/logoDesktop.svg';
import { ReactComponent as LogoMobile } from '../../assets/svg/logoMobile.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import { PenInfo } from '../../components/index';
import { fetchAuthLogout, logout, selectIsAuth, selectUserAvatarUrl } from '../../redux/slices/auth';
import { followSearchQuery } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { EditorControls } from '../EditorControls/EditorControls';
import styles from './Header.module.scss';

const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [width, setWidth] = useState(window.innerWidth);

  const changeSearchInput = ({ target }: { target: HTMLInputElement }) => {
    dispatch(followSearchQuery(target.value));
  };

  const homeLinkRef = useRef<HTMLAnchorElement>(null);

  const handleWindowResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleWindowResize);

  const onClickLogout = () => setOpen(true);

  const handleConfirmLogout = async () => {
    await dispatch(fetchAuthLogout());
    homeLinkRef.current?.click();
    dispatch(logout());
    setOpen(false);
    setAnchorEl(null);
  };

  const userAvatar = useSelector(selectUserAvatarUrl);
  const locationRouter = useLocation();

  const clearPath = locationRouter.pathname.slice(0, 7);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__inner}>
          <Link to={clearPath !== '/editing' ? '/' : '/editor'}>
            {width > 700 && clearPath !== '/editor' ? <LogoDesktop /> : <LogoMobile />}
          </Link>
          {clearPath === '/editor' && (
            <>
              <PenInfo />
              <EditorControls />
            </>
          )}
          {clearPath === '/editing' && <EditorControls />}
          {locationRouter.pathname === '/' && (
            <form className={styles.header__form} onSubmit={(e) => e.preventDefault()}>
              <label className={styles['header__form-label']}>
                <Magnifier className={styles['header__form-icon']} />
                <input
                  className={styles.header__input}
                  onChange={changeSearchInput}
                  type="text"
                  placeholder="Search CodePen..."
                />
              </label>
            </form>
          )}
          {clearPath !== '/editing' && (
            <div className={styles.header__buttons}>
              {isAuth ? (
                <>
                  <span onClick={handleClick}>
                    <img className={styles.header__avatar} src={userAvatar} title="Profile" alt="avatar" />
                  </span>
                  <Menu
                    anchorEl={anchorEl}
                    open={openUserMenu}
                    onClose={handleClose}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    autoFocus={false}
                    PaperProps={{
                      style: {
                        marginTop: '5px',
                        marginRight: '50px',
                      },
                    }}
                  >
                    <MenuItem>
                      <NavLink to="/" onClick={handleClose} className={styles['header__menu-item']}>
                        <Work style={{ marginRight: '5px', color: 'white' }} />
                        You Work
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/profile" onClick={handleClose} className={styles['header__menu-item']}>
                        <Person style={{ marginRight: '5px', color: 'white' }} />
                        Profile
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <span onClick={onClickLogout} className={styles['header__menu-item']}>
                        <ExitToApp style={{ marginRight: '5px', color: 'white' }} />
                        Log Out
                      </span>
                      <NavLink ref={homeLinkRef} to="/" hidden></NavLink>
                    </MenuItem>
                  </Menu>
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
          )}
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
