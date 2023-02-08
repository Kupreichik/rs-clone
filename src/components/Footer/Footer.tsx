import cn from 'classnames';

import { ReactComponent as Github } from '../../assets/svg/github.svg';
import { ReactComponent as RSS } from '../../assets/svg/rss.svg';
import styles from './footer.module.scss';

function getCurrentYear() {
  return new Date().getFullYear();
}

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footer__inner}>
          <div className={styles.footer__items}>
            <div className={styles.footer__item}>
              <a
                className={cn(styles['footer__item-link'], styles['footer__item-link1'])}
                href="https://github.com/Dazmond-ru"
                target="_blank"
                rel="noreferrer"
              >
                <Github className={styles.footer__svg} />
                Sergey Fedorov
              </a>
            </div>
            <div className={styles.footer__item}>
              <a
                className={cn(styles['footer__item-link'], styles['footer__item-link2'])}
                href="https://github.com/Kupreichik"
                target="_blank"
                rel="noreferrer"
              >
                <Github className={styles.footer__svg} />
                Julia Kupreichik
              </a>
            </div>
            <div className={styles.footer__item}>
              <a
                className={cn(styles['footer__item-link'], styles['footer__item-link3'])}
                href="https://github.com/andb106"
                target="_blank"
                rel="noreferrer"
              >
                <Github className={styles.footer__svg} />
                Andrey Boytsov
              </a>
            </div>
          </div>
          <p className={styles.footer__copyright}>Copyright @{getCurrentYear()}</p>
          <div className={styles.footer__item}>
            <a
              className={cn(styles['footer__item-link'], styles['footer__item-link-rss'])}
              href="https://rs.school/js/"
              target="_blank"
              rel="noreferrer"
            >
              <RSS className={styles.footer__svg} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
