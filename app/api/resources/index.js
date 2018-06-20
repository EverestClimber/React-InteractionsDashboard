import axios from '../config';

export function getResources() {
  const config = {
    method: 'GET',
    url: '/resources/',
  };

  return axios(config);
}
