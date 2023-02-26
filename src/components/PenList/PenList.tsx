import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import styles from '../../pages/Home/HomePage.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { getPens, getPensQuery, getPensStatus } from '../../redux/slices/pens';
import { IPenData, PenItem, Preloader } from '../index';

interface IPenListProps {
  getTabsPens: () => IPenData[];
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

export const PenList = ({ getTabsPens, pageNumber, setPageNumber }: IPenListProps) => {
  const status = useSelector(getPensStatus);
  const pensQuery = useSelector(getPensQuery);

  const itemInPage = 6;

  const isAuth = useSelector(selectIsAuth);

  const allPens = useSelector(getPens);

  const pens = isAuth ? getTabsPens() : allPens.slice().sort((pen1, pen2) => pen2.viewsCount - pen1.viewsCount);

  const pensSearchFIlter = pens.filter(({ title, html, css, js, user }) =>
    [title, html, css, js, user.username].some((field) => field.toLowerCase().includes(pensQuery.toLowerCase())),
  );

  const pensPagination = pensSearchFIlter.filter(
    (_, i) => i >= (pageNumber - 1) * itemInPage && i < itemInPage * pageNumber,
  );

  useEffect(() => {
    setPageNumber(1);
  }, [pensQuery, setPageNumber]);

  return status !== 'loaded' ? (
    <Preloader />
  ) : (
    <>
      <div className={styles.home__items}>
        {pensPagination.length
          ? pensPagination.map((penData) => <PenItem key={penData._id} {...penData} />)
          : 'No pens found'}
      </div>
      <div className={styles['home__btns']}>
        <span
          className={cn(styles['home__btn-pagination'], 'button')}
          onClick={() => setPageNumber(pageNumber - 1)}
          style={{ display: pageNumber === 1 ? 'none' : 'flex' }}
        >
          <ArrowBackIosNewOutlined sx={{ fontSize: '18px' }} />
          Prev
        </span>
        <span
          className={cn(styles['home__btn-pagination'], 'button')}
          onClick={() => setPageNumber(pageNumber + 1)}
          style={{ display: pageNumber >= pensSearchFIlter.length / itemInPage ? 'none' : 'flex' }}
        >
          Next
          <ArrowForwardIosOutlined sx={{ fontSize: '18px' }} />
        </span>
      </div>
    </>
  );
};
