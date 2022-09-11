import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      console.log('error');
    }
    return Promise.reject(err);
  }
);

export default request;
