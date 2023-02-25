import cn from 'classnames';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PenList } from '../../components/index';
import {
  clearEditor,
  clearSearchQuery,
  fetchPens,
  fetchPensLoved,
  updateEditorCSS,
  updateEditorHTML,
  updateEditorJS,
} from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { getPenData } from '../../utils/localstorage';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const dispatch = useAppDispatch();

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
  }, []);

  useEffect(() => {
    dispatch(fetchPensLoved());
  }, []);

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
