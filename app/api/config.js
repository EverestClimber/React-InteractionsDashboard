import axios from 'axios';
import routes from '../routes';


function createAxiosInstance(unauthorizedCallback) {
  const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api/v1'
    : 'https://interactions.dev.deepsine.com/api/v1';

  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    validateStatus: (status) => {
      const unauthorizedStatus = 401;
      if (status === unauthorizedStatus) {
        unauthorizedCallback();
      }
      return status >= 200 && status < 400;
    },
  });
}


function logout() {
  localStorage.removeItem('token');
  if (window.location.pathname !== routes.LOGIN.path) {
    window.location.pathname = routes.LOGIN.path;
  }
}


export const axiosInstance = createAxiosInstance(logout);


export default function request(params) {
  const token = localStorage.getItem('token');

  return axiosInstance({
    headers: {
      Authorization: token ? `JWT ${token}` : undefined,
    },
    ...params,
  });
}
