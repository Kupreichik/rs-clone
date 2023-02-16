import { useSelector } from 'react-redux';

import styles from '../../pages/home.module.scss';
import { RootState } from '../../redux/store';
import { PenItem } from '../PenItem/PenItem';

export const PenList = () => {
  const pens = useSelector((state: RootState) => state.pens.pens);
  const status = useSelector((state: RootState) => state.pens.status);

  return status !== 'loaded' ? (
    <div style={{ textAlign: 'center' }}>Loading...</div>
  ) : (
    <div className={styles.home__items}>
      {pens.map((penData) => (
        <PenItem key={penData._id} {...penData} />
      ))}
    </div>
  );
};
