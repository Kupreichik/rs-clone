import { useEffect, useState } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const keyLS = 'codepen-clone-' + key;

  const [value, setValue] = useState(() => {
    const valueLS = localStorage.getItem(keyLS);

    if (valueLS !== null) {
      return JSON.parse(valueLS);
    }

    if (typeof initialValue === 'function') {
      return initialValue();
    }

    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(keyLS, JSON.stringify(value));
  }, [keyLS, value]);

  return [value, setValue];
};

export default useLocalStorage;
