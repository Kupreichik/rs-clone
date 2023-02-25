import '../../styles/menu.scss';

import { ExitToApp, Person, Work } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import cn from 'classnames';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';

import { ReactComponent as LogoDesktop } from '../../assets/svg/logoDesktop.svg';
import { ReactComponent as LogoMobile } from '../../assets/svg/logoMobile.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import { PenInfo } from '../../components/index';
import { fetchAuthLogout, logout, selectIsAuth, selectUserAvatarUrl } from '../../redux/slices/auth';
import { clearPenLoved, clearSearchQuery, followSearchQuery } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { EditorControls } from '../EditorControls/EditorControls';
import styles from './Header.module.scss';

const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isMobile = useMediaQuery('(min-width: 700px)');

  const changeSearchInput = ({ target }: { target: HTMLInputElement }) => {
    dispatch(followSearchQuery(target.value));
  };

  const homeLinkRef = useRef<HTMLAnchorElement>(null);

  const onClickLogout = () => setOpen(true);

  const onClickClearSearchQuery = () => dispatch(clearSearchQuery());

  const handleConfirmLogout = async () => {
    await dispatch(fetchAuthLogout());
    dispatch(logout());
    dispatch(clearPenLoved());
    setOpen(false);
    onClickClearSearchQuery();
    setAnchorEl(null);
    homeLinkRef.current?.click();
  };

  const userAvatar = useSelector(selectUserAvatarUrl);
  const locationRouter = useLocation();

  const clearPath = locationRouter.pathname.slice(0, 7);
  const isEditorMode = clearPath === '/editor';
  const isEditingRoomMode = clearPath === '/editin';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuItem = () => {
    setAnchorEl(null);
    onClickClearSearchQuery();
  };

  const menuItemStyle = { marginRight: '5px', color: 'white' };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__inner}>
          <Link to={!isEditingRoomMode ? '/' : '/editor'}>
            {isMobile && !isEditorMode ? (
              <LogoDesktop onClick={onClickClearSearchQuery} />
            ) : (
              <LogoMobile onClick={onClickClearSearchQuery} />
            )}
          </Link>
          {isEditorMode && (
            <>
              <PenInfo />
              <EditorControls />
            </>
          )}
          {isEditingRoomMode && <EditorControls />}
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
          {!isEditingRoomMode && (
            <div className={styles.header__buttons}>
              {isAuth ? (
                <>
                  <span onClick={handleClickMenu}>
                    <img className={styles.header__avatar} src={userAvatar} title="Profile" alt="avatar" />
                  </span>
                  <Menu
                    anchorEl={anchorEl}
                    open={openUserMenu}
                    onClose={handleCloseMenuItem}
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
                      <NavLink to="/" onClick={handleCloseMenuItem} className={styles['header__menu-item']}>
                        <Work style={menuItemStyle} />
                        You Work
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/profile" onClick={handleCloseMenuItem} className={styles['header__menu-item']}>
                        <Person style={menuItemStyle} />
                        Profile
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <span onClick={onClickLogout} className={styles['header__menu-item']}>
                        <ExitToApp style={menuItemStyle} />
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
