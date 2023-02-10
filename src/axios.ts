import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://rs-clone-api.onrender.com/',
});

instance.interceptors.request.use((config) => {
  config.headers.Authorizations = window.localStorage.getItem('token');
  return config;
});

export default instance;
