import cn from 'classnames';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PenList } from '../../components/index';
import {
  clearEditor,
  fetchPens,
  getPenDataFromLocaStorage,
  updateEditorCSS,
  updateEditorHTML,
  updateEditorJS,
} from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const dispatch = useAppDispatch();

  const onLink = () => {
    dispatch(clearEditor());

    const penDataFromLocalStorage = getPenDataFromLocaStorage();

    if (penDataFromLocalStorage.htmlLS !== null) {
      dispatch(updateEditorHTML(JSON.parse(penDataFromLocalStorage.htmlLS)));
    }
    if (penDataFromLocalStorage.cssLS !== null) {
      dispatch(updateEditorCSS(JSON.parse(penDataFromLocalStorage.cssLS)));
    }
    if (penDataFromLocalStorage.jsLS !== null) {
      dispatch(updateEditorJS(JSON.parse(penDataFromLocalStorage.jsLS)));
    }
  };

  useEffect(() => {
    dispatch(fetchPens());
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
