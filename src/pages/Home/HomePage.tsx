import cn from 'classnames';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { PenList } from '../../components/index';
import { selectIsAuth, selectUserName } from '../../redux/slices/auth';
import {
  clearEditor,
  clearSearchQuery,
  fetchLikesUserPens,
  fetchPens,
  getLikesUserPens,
  getPens,
  updateEditorCSS,
  updateEditorHTML,
  updateEditorJS,
} from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { getPenData } from '../../utils/localstorage';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('allPens');
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useAppDispatch();

  const isAuth = useSelector(selectIsAuth);

  const onLink = () => {
    dispatch(clearEditor());
    dispatch(clearSearchQuery());

    const { html, css, js } = getPenData();

    dispatch(updateEditorHTML(html));
    dispatch(updateEditorCSS(css));
    dispatch(updateEditorJS(js));
  };

  useEffect(() => {
    dispatch(fetchPens());
    dispatch(fetchLikesUserPens());
  }, [dispatch]);

  useEffect(() => {
    setPageNumber(1);
  }, [activeTab]);

  const pens = useSelector(getPens);
  const name = useSelector(selectUserName);
  const likes = useSelector(getLikesUserPens);

  const getTabsPens = () => {
    if (activeTab === 'allPens') {
      return pens;
    } else if (activeTab === 'youWork') {
      return pens.filter((pen) => pen.user.name === name);
    } else if (activeTab === 'likes') {
      return likes;
    }
    return [];
  };

  const handleTabClick = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
    getTabsPens();
  };

  return (
    <section className="home">
      <div className="container" style={{ maxWidth: '1210px' }}>
        <div className={styles.home__inner}>
          <Link onClick={onLink} className={cn(styles.home__btn, 'button')} to="/editor">
            <span className={styles['home__btn-span']}>Start Coding</span>
          </Link>

          {isAuth ? (
            <div className={styles.home__login}>
              <nav>
                <ul className={styles['home__login-list']}>
                  <li
                    className={cn(styles['home__login-item'], {
                      [styles['home__login-active']]: activeTab === 'allPens',
                    })}
                    onClick={() => handleTabClick('allPens')}
                  >
                    All Pens
                  </li>
                  <li
                    className={cn(styles['home__login-item'], {
                      [styles['home__login-active']]: activeTab === 'youWork',
                    })}
                    onClick={() => handleTabClick('youWork')}
                  >
                    You Work
                  </li>
                  <li
                    className={cn(styles['home__login-item'], {
                      [styles['home__login-active']]: activeTab === 'likes',
                    })}
                    onClick={() => handleTabClick('likes')}
                  >
                    Likes
                  </li>
                </ul>
              </nav>
            </div>
          ) : (
            ''
          )}

          <PenList getTabsPens={getTabsPens} pageNumber={pageNumber} setPageNumber={setPageNumber} />
        </div>
      </div>
    </section>
  );
};
