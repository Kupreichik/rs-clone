import { useSelector } from 'react-redux';

import styles from '../../pages/Home/HomePage.module.scss';
import { getPens, getPensStatus } from '../../redux/slices/pens';
import { PenItem, Preloader } from '../index';

export const PenList = () => {
  const pens = useSelector(getPens);
  const status = useSelector(getPensStatus);

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
