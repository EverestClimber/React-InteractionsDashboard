import axios from 'axios';

function createAxiosInstance(unauthorizedCallback) {
  const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api/v1'
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
        unauthorizedCallback();
      }

      return status >= 200 && status < 400;
    },
  });

  return instance;
}

function logout() {
  localStorage.removeItem('token');
  // if (window.location.pathname !== routes.LOGIN.path) {
  //   window.location.pathname = routes.LOGIN.path;
  // }
}

const instance = createAxiosInstance(logout);

export default instance;
