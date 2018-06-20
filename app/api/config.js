import axios from 'axios';
import { push } from 'react-router-redux';

import { store } from '../app';

function createAxiosInstance(unauthorizedCallback) {
  const baseURL = process.env.NODE_ENV === 'development'
    ? 'https://interactions.dev.deepsine.com/api/v1'
    : 'https://interactions.dev.deepsine.com/api/v1';

  const token = localStorage.getItem('token');

  const instance = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `JWT ${token}` : undefined,
      'Content-Type': 'application/json',
    },
    validateStatus: (status) => {
      const unauthorizedStatus = 401;

      if (status === unauthorizedStatus) {
        // @todo: dispatch logout event instead of manual local storage cleaning
        unauthorizedCallback();
      }

      return status >= 200 && status < 400;
    },
  });

  return instance;
}

function logout() {
  localStorage.removeItem('token');
  store.dispatch(push('/login'));
}

const instance = createAxiosInstance(logout);

export default instance;
