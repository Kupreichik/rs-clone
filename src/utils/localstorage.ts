import { IPenData } from '../components';

type StorePenData = Pick<IPenData, 'html' | 'css' | 'js'>;
const PEN_DATA_KEY = 'rs-clone-pen-data';
const emptyPenData: StorePenData = {
  html: '',
  css: '',
  js: '',
};

export const storePenData = (penData: StorePenData) => {
  localStorage.setItem(PEN_DATA_KEY, JSON.stringify(penData));
};

export const getPenData = (): StorePenData => {
  const data = localStorage.getItem(PEN_DATA_KEY);

  return data === null ? emptyPenData : JSON.parse(data);
};

export const clearPenDataLocalStorage = () => {
  localStorage.removeItem(PEN_DATA_KEY);
};
