import cn from 'classnames';
import { Link } from 'react-router-dom';

import { PenList } from '../components/PenList/PenList';
import { updateData } from '../redux/slices/editor';
import { useAppDispatch } from '../redux/store';
import styles from './home.module.scss';

export const Homepage = () => {
  const dispatch = useAppDispatch();
  const onLink = () => {
    dispatch(updateData({ data: null }));
  };

  return (
    <section className="home">
      <div className="container" style={{ maxWidth: '1500px' }}>
        <div className={styles.home__inner}>
          <Link onClick={onLink} className={cn(styles.home__btn, 'button')} to="/editor">
            <span className={styles['home__btn-span']}>Start Coding</span>
          </Link>
          <PenList />
        </div>
      </div>
    </section>
  );
};
