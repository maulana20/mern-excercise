import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';

// Create an instance of axios
const api = axios.create({
  withCredentials: true,
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.config.url !== "/auth" && err.response) {
      if (err.response.status === 401 && !err.config._retry) {
        err.config._retry = true;
        try {
          const currentState = store.getState();
          await api.get("/auth/refresh/" + currentState.auth.user._id);
          return api(err.config);
        } catch (error) {
          store.dispatch({ type: LOGOUT });
          return Promise.reject(error);
        }
      }
    }
    
    return Promise.reject(err);
  }
);

export default api;
