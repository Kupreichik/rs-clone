import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from '../../pages/Home/HomePage.module.scss';
import { getPens, getPensQuery, getPensStatus } from '../../redux/slices/pens';
import { PenItem, Preloader } from '../index';

export const PenList = () => {
  const [count, setCount] = useState(1);
  const status = useSelector(getPensStatus);
  const pensQuery = useSelector(getPensQuery);

  const itemInPage = 6;

  const pens = useSelector(getPens);
  const pensSearchFIlter = pens.filter(
    (pen) =>
      pen.title.toLowerCase().includes(pensQuery.toLowerCase()) ||
      pen.html.toLowerCase().includes(pensQuery.toLowerCase()) ||
      pen.css.toLowerCase().includes(pensQuery.toLowerCase()) ||
      pen.js.toLowerCase().includes(pensQuery.toLowerCase()),
  );

  const pensPagination = pensSearchFIlter.filter((_, i) => i >= (count - 1) * itemInPage && i < itemInPage * count);

  useEffect(() => {
    setCount(1);
  }, [pensQuery]);

  return status !== 'loaded' ? (
    <Preloader />
  ) : (
    <>
      <div className={styles.home__items}>
        {pensPagination.map((penData) => (
          <PenItem key={penData._id} {...penData} />
        ))}
      </div>
      <div className={styles['home__btns']}>
        <span
          className={cn(styles['home__btn-pagination'], 'button')}
          onClick={() => setCount(count - 1)}
          style={{ display: count === 1 ? 'none' : 'flex' }}
        >
          <ArrowBackIosNewOutlined sx={{ fontSize: '18px' }} />
          Prev
        </span>
        <span
          className={cn(styles['home__btn-pagination'], 'button')}
          onClick={() => setCount(count + 1)}
          style={{ display: count >= pensSearchFIlter.length / itemInPage ? 'none' : 'flex' }}
        >
          Next
          <ArrowForwardIosOutlined sx={{ fontSize: '18px' }} />
        </span>
      </div>
    </>
  );
};
