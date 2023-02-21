import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://rs-clone-api.onrender.com/',
  // baseURL: 'http://localhost:3033/',
  withCredentials: true,
});

export default instance;
