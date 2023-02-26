import '../../styles/menu.scss';

import { ExitToApp, Person, Work } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import cn from 'classnames';
import { MouseEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';

import { ReactComponent as LogoDesktop } from '../../assets/svg/logoDesktop.svg';
import { ReactComponent as LogoMobile } from '../../assets/svg/logoMobile.svg';
import { ReactComponent as Magnifier } from '../../assets/svg/magnifier.svg';
import { PenInfo } from '../../components/index';
import { fetchAuthLogout, logout, selectIsAuth, selectUserAvatarUrl } from '../../redux/slices/auth';
import {
  changeTabs,
  clearPensLoved,
  clearSearchQuery,
  followSearchQuery,
  getPensQuery,
  selectYouWorkTab,
} from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { EditorControls } from '../EditorControls/EditorControls';
import styles from './Header.module.scss';

const setLoginButton = ({ isActive }: { isActive: boolean }) => ({ display: isActive ? 'none' : 'block' });

export const Header = () => {
  const dispatch = useAppDispatch();
  const isAuth = useSelector(selectIsAuth);
  const isMobile = useMediaQuery('(min-width: 700px)');
  const userAvatar = useSelector(selectUserAvatarUrl);
  const locationRouter = useLocation();

  //* input
  const pensQuery = useSelector(getPensQuery);

  const changeSearchInput = ({ target }: { target: HTMLInputElement }) => {
    dispatch(followSearchQuery(target.value));
  };

  const onClickClearSearchQuery = () => {
    dispatch(changeTabs('trending'));
    dispatch(clearSearchQuery());
  };

  //* logout

  const onClickLogout = () => setOpenDialog(true);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    setOpenDialog(false);
    setAnchorEl(null);
    await dispatch(fetchAuthLogout());
    dispatch(logout());
    homeLinkRef.current?.click();
    onClickClearSearchQuery();
    dispatch(clearPensLoved());
    dispatch(selectYouWorkTab());
    navigate('/');
  };

  const homeLinkRef = useRef<HTMLAnchorElement>(null);

  const clearPath = locationRouter.pathname.slice(0, 7);
  const isEditorMode = clearPath === '/editor';
  const isEditingRoomMode = clearPath === '/editin';

  //* dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuItem: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const { target } = event;
    setAnchorEl(null);
    onClickClearSearchQuery();
    if ((target as HTMLLIElement).textContent === 'You Work') {
      dispatch(selectYouWorkTab());
    }
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
                  value={pensQuery}
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
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ style: { backgroundColor: '#1e1f26', color: 'white', paddingBottom: '20px' } }}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to Log Out?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ minWidth: '105px' }}>
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
