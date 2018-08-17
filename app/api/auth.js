import { axiosInstance as axios } from './config';

export function postObtainToken(email, password) {
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

export function postRefreshToken() {
  const token = localStorage.getItem('token');
  const config = {
    method: 'POST',
    url: '/token/refresh/',
    data: { token },
  };

  return axios(config);
}

export function postVerifyToken() {
  const token = localStorage.getItem('token');
  const config = {
    method: 'POST',
    url: '/token/verify/',
    data: { token },
  };

  return axios(config);
}

export function postPasswordReset(email) {
  const config = {
    method: 'POST',
    url: '/rest-auth/password/reset/',
    data: { email },
  };

  return axios(config);
}

export function postPasswordResetConfirm(
  uid,
  token,
  new_password1,
  new_password2
) {
  const config = {
    method: 'POST',
    url: '/rest-auth/password/reset/confirm/',
    data: {
      postPasswordResetConfirm,
      uid,
      token,
      new_password1,
      new_password2,
    },
  };

  return axios(config);
}
