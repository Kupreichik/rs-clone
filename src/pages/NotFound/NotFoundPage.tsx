import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  return (
    <section className={styles.notefoundpage}>
      <div className={styles.notefoundpage__inner}>
        <h1 className={styles.notefoundpage__title}>404</h1>
        <p>
          I&apos;m afraid you&apos;ve found a page that doesn&apos;t exist on CodePen. That can happen when you follow a
          link to something that has since been deleted. Or the link was incorrect to begin&nbsp;with.
        </p>
        <p>Sorry about that. We&apos;ve logged the error for review, in case it&apos;s our fault.</p>
        <Link to="/" className={styles.notefoundpage__link}>
          Go to the homepage
        </Link>
      </div>
    </section>
  );
};
