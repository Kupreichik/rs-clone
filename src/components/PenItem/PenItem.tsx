import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

import styles from '../../pages/home.module.scss';

export interface IPenData {
  _id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  likesCount: number;
  viewsCount: number;
  user: IUser;
}

interface IUser {
  name: string;
  username: string;
  avatar: string;
}

export const PenItem = (data: IPenData) => {
  const srcDoc = `
    <html>
      <body>${data.html}</body>
      <style>html{overflow: hidden;}</style>
      <style>${data.css}</style>
      <script>${data.js}</script>
    </html>
  `;
  const [heartIcon, setHeartIcon] = useState(false);

  return (
    <div onClick={() => console.log('click pen item')} className={styles.home__item}>
      <div className={styles['home__item-content']}>
        <div className={styles['home__item-background']}></div>
        <div className={styles['home__item-iframe-wrapper']}>
          <iframe
            style={{ border: 0 }}
            srcDoc={srcDoc}
            title="results"
            sandbox="allow-scripts"
            width="100%"
            height="100%"
          />
        </div>
        <div className={styles['home__item-info']}>
          <img className={styles['home__item-avatar']} src={data.user.avatar} alt="avatar" />
          <div className={styles['home__item-description']}>
            <h4 className={styles['home__item-title']}>{data.title}</h4>
            <p className={styles['home__item-author']}>{data.user.username}</p>
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
        <div className={styles['home__item-stats']}>
          <div className={styles['home__item-stats-content']}>
            <IoMdHeart />
            <span>{data.likesCount}</span>
          </div>
          <div className={styles['home__item-stats-content']}>
            <FaEye />
            <span>{data.likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};