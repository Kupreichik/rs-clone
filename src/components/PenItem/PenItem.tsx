import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from '../../pages/Home/HomePage.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import {
  addPenToLoved,
  clearSearchQuery,
  deletePen,
  getPensLoved,
  getTabs,
  updateAllCurrentPenData,
} from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { getSrcDoc } from '../index';
import { SnackbarCustom } from '../Snackbar/Snackbar';

export interface IPenData {
  _id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  likesCount: number;
  viewsCount: number;
  user: IUser;
}

interface IUser {
  name: string;
  username: string;
  avatar: string;
}

const isLikedPen = (pens: IPenData[], id: string) => {
  const ind = pens.findIndex((pen) => pen._id === id);
  return ind !== -1;
};

export const PenItem = (data: IPenData) => {
  const srcDoc = getSrcDoc(data, 'html{overflow: hidden;}');
  const penLoved = useSelector(getPensLoved);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [heartIcon, setHeartIcon] = useState(isLikedPen(penLoved, data._id));

  const dispatch = useAppDispatch();

  const isAuth = useSelector(selectIsAuth);
  const activeTab = useSelector(getTabs);

  const onLink = () => {
    dispatch(updateAllCurrentPenData({ ...data }));
    dispatch(clearSearchQuery());
  };

  const onClickLike = async () => {
    if (isAuth) {
      await dispatch(addPenToLoved(data._id));
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleConfirmDelete = async () => {
    await dispatch(deletePen(data._id));
    setOpenDialog(false);
  };

  useEffect(() => {
    setHeartIcon(isLikedPen(penLoved, data._id));
  }, [data._id, penLoved]);

  return (
    <div className={styles.home__item}>
      <div className={styles['home__item-background']}></div>
      <div className={styles['home__item-iframe-wrapper']}>
        <iframe
          style={{ border: 0 }}
          srcDoc={srcDoc}
          title="results"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
        />
        <Link onClick={onLink} className={styles['home__item-link']} to={`/editor/${data._id}`}>
          <span hidden>Open Editor</span>
        </Link>
      </div>
      <div className={styles['home__item-info']}>
        <img className={styles['home__item-avatar']} src={data.user.avatar} alt="avatar" />
        <div className={styles['home__item-description']}>
          <h4 className={styles['home__item-title']}>{data.title}</h4>
          <p className={styles['home__item-author']}>{data.user.name}</p>
        </div>
        <div className={styles['home__item-controls']}>
          <div className={styles['home__item-like']} onClick={onClickLike}>
            {heartIcon ? (
              <IoMdHeart className={styles['home__item-icon']} />
            ) : (
              <IoMdHeartEmpty className={styles['home__item-icon']} />
            )}
          </div>
          {activeTab === 'youWork' && (
            <div onClick={() => setOpenDialog(true)} className={styles['home__item-delete']}>
              <MdDeleteForever className={styles['home__item-icon']} />
            </div>
          )}
        </div>
      </div>
      <div className={styles['home__item-stats']}>
        <div className={styles['home__item-stats-content']}>
          <IoMdHeart />
          <span>{data.likesCount}</span>
        </div>
        <div className={styles['home__item-stats-content']}>
          <FaEye />
          <span>{data.viewsCount}</span>
        </div>
      </div>
      <SnackbarCustom
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity="error"
        customWidth={200}
        message="LOG IN to like"
      />
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ style: { backgroundColor: '#1e1f26', color: 'white', paddingBottom: '20px' } }}
      >
        <DialogTitle textAlign={'center'}>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete pen?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ minWidth: '105px' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ minWidth: '105px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
