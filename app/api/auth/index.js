import axios from '../config';

export function obtainToken(email, password) {
  const config = {
    method: 'POST',
    url: '/token/obtain/',
    data: {
      email,
      password,
    },
  };

  return axios(config);
}

export function refreshToken() {
  const token = localStorage.getItem('token');
  const config = {
    method: 'POST',
    url: '/token/refresh/',
    data: { token },
  };

  return axios(config);
}

export function verifyToken() {
  const token = localStorage.getItem('token');
  const config = {
    method: 'POST',
    url: '/token/verify/',
    data: { token },
  };

  return axios(config);
}
