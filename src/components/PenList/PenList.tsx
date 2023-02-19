import { useSelector } from 'react-redux';

import styles from '../../pages/Home/HomePage.module.scss';
import { getPens, getPensQuery, getPensStatus } from '../../redux/slices/pens';
import { PenItem, Preloader } from '../index';

export const PenList = () => {
  const status = useSelector(getPensStatus);
  const pensQuery = useSelector(getPensQuery);

  const pens = useSelector(getPens).filter(
    (pen) =>
      pen.title.toLowerCase().includes(pensQuery.toLowerCase()) ||
      pen.html.toLowerCase().includes(pensQuery.toLowerCase()) ||
      pen.css.toLowerCase().includes(pensQuery.toLowerCase()) ||
      pen.js.toLowerCase().includes(pensQuery.toLowerCase()),
  );

  return status !== 'loaded' ? (
    <Preloader />
  ) : (
    <div className={styles.home__items}>
      {pens.map((penData) => (
        <PenItem key={penData._id} {...penData} />
      ))}
    </div>
  );
};
