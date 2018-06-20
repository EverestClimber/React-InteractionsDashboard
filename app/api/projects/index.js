import axios from '../config';

export function getProjects() {
  const config = {
    method: 'GET',
    url: '/projects/',
  };

  return axios(config);
}
