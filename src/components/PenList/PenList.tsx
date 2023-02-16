import axios from 'axios';
import { useEffect, useState } from 'react';

import styles from '../../pages/home.module.scss';
import { IPenData, PenItem } from '../PenItem/PenItem';

export const PenList = () => {
  const [pens, setPens] = useState<IPenData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchPenData();
  }, []);

  async function fetchPenData() {
    try {
      const response = await axios.get<IPenData[]>('https://rs-clone-api.onrender.com/pens');
      setPens(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  if (!isLoaded) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>;
  } else {
    return (
      <div className={styles.home__items}>
        {pens.map((penData) => (
          <PenItem key={penData._id} {...penData} />
        ))}
      </div>
    );
  }
};
