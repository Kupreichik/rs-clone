import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { Link } from 'react-router-dom';

import styles from '../../pages/Home/HomePage.module.scss';
import { updateEditorData, updatePenData } from '../../redux/slices/editor';
import { useAppDispatch } from '../../redux/store';
import { getSrcDoc } from '../index';

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
  const srcDoc = getSrcDoc(data, 'html{overflow: hidden;}');
  const [heartIcon, setHeartIcon] = useState(false);

  const dispatch = useAppDispatch();

  const onLink = () => {
    dispatch(updatePenData({ data }));
    dispatch(updateEditorData({ ...data }));
  };

  return (
    <div className={styles.home__item}>
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
          <Link onClick={onLink} className={styles['home__item-link']} to={`/editor/${data._id}`}>
            <span hidden>Open Editor</span>
          </Link>
        </div>
        <div className={styles['home__item-info']}>
          <img className={styles['home__item-avatar']} src={data.user.avatar} alt="avatar" />
          <div className={styles['home__item-description']}>
            <h4 className={styles['home__item-title']}>{data.title}</h4>
            <p className={styles['home__item-author']}>{data.user.name}</p>
          </div>
          <div
            className={styles['home__item-like']}
            onMouseEnter={() => setHeartIcon(true)}
            onMouseLeave={() => setHeartIcon(false)}
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
