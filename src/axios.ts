import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://rs-clone-api.onrender.com/',
});

export default instance;
