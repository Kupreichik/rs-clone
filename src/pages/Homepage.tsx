import cn from 'classnames';
import { useState } from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '../redux/store';
import styles from './home.module.scss';

export const Homepage = () => {
  const userAvatar = useSelector((state: RootState) => state.auth.data?.avatar);
  const userName = useSelector((state: RootState) => state.auth.data?.username);

  const [heartIcon, setHeartIcon] = useState(false);

  return (
    <section className="home">
      <div className="container" style={{ maxWidth: '1500px' }}>
        <div className={styles.home__inner}>
          <Link className={cn(styles.home__btn, 'button')} to="/editor">
            <span className={styles['home__btn-span']}>Start Coding</span>
          </Link>
          <div className={styles.home__items}>
            <div className={styles.home__item}>
              <div className={styles['home__item-content']}>
                <div className={styles['home__item-background']}></div>
                <img className={styles['home__item-img']} src="http://placehold.it/350x200" alt="placeholder" />
                <div className={styles['home__item-info']}>
                  <img className={styles['home__item-avatar']} src={userAvatar} alt="avatar" />
                  <div className={styles['home__item-description']}>
                    <h4 className={styles['home__item-title']}>SSSsssssssssssssssssssssssssssssssssssssss</h4>
                    <p className={styles['home__item-author']}>{userName}</p>
                  </div>
                  <div
                    className={styles['home__item-like']}
                    onMouseOver={() => setHeartIcon(true)}
                    onMouseOut={() => setHeartIcon(false)}
                  >
                    {heartIcon ? (
                      <IoMdHeart className={styles['home__item-icon']} />
                    ) : (
                      <IoMdHeartEmpty className={styles['home__item-icon']} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            {/*  */}
          </div>
        </div>
      </div>
    </section>
  );
};
