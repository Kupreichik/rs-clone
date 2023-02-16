import cn from 'classnames';
import { Link } from 'react-router-dom';

import { PenList } from '../components/PenList/PenList';
import styles from './home.module.scss';

export const Homepage = () => {
  return (
    <section className="home">
      <div className="container" style={{ maxWidth: '1500px' }}>
        <div className={styles.home__inner}>
          <Link className={cn(styles.home__btn, 'button')} to="/editor">
            <span className={styles['home__btn-span']}>Start Coding</span>
          </Link>
          <PenList />
        </div>
      </div>
    </section>
  );
};
