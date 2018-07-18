import axios from './config';


export function getResources(params) {
  const config = {
    method: 'GET',
    url: '/resources/',
    params,
  };

  return axios(config);
}
