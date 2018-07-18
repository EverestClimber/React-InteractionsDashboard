import axios from '../config';

export function getProjects(params) {
  const config = {
    method: 'GET',
    url: '/projects/',
    params,
  };

  return axios(config);
}
