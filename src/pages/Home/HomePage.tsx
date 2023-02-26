import cn from 'classnames';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { PenList } from '../../components/index';
import { selectIsAuth, selectUserName } from '../../redux/slices/auth';
import {
  changeTabs,
  clearEditor,
  clearSearchQuery,
  fetchPens,
  fetchPensLoved,
  getPens,
  getPensLoved,
  getTabs,
  updateEditorCSS,
  updateEditorHTML,
  updateEditorJS,
} from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { getPenData } from '../../utils/localstorage';
import styles from './HomePage.module.scss';

export const HomePage = () => {
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
    if (isAuth) {
      dispatch(fetchPensLoved());
    }
  }, [dispatch, isAuth]);

  const pens = useSelector(getPens);
  const name = useSelector(selectUserName);
  const likes = useSelector(getPensLoved);

  const tabs = useSelector(getTabs);

  const getTabsPens = () => {
    if (tabs === 'trending') {
      return pens.slice().sort((pen1, pen2) => pen2.viewsCount - pen1.viewsCount);
    } else if (tabs === 'youWork') {
      return pens.filter((pen) => pen.user.name === name);
    } else if (tabs === 'likes') {
      return likes;
    }
    return [];
  };

  const handleTabClick = (tab: SetStateAction<string>) => {
    dispatch(changeTabs(tab));
    getTabsPens();
  };

  useEffect(() => {
    setPageNumber(1);
  }, [tabs]);

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
                      [styles['home__login-active']]: tabs === 'trending',
                    })}
                    onClick={() => handleTabClick('trending')}
                  >
                    Trending
                  </li>
                  <li
                    className={cn(styles['home__login-item'], {
                      [styles['home__login-active']]: tabs === 'youWork',
                    })}
                    onClick={() => handleTabClick('youWork')}
                  >
                    You Work
                  </li>
                  <li
                    className={cn(styles['home__login-item'], {
                      [styles['home__login-active']]: tabs === 'likes',
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
