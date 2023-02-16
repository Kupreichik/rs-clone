import styles from './preloader.module.scss';

const Preloader = () => {
  return (
    <div className={styles.preloader}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Preloader;
