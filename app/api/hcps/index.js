import axios from '../config';

export function getHCPs() {
  const config = {
    method: 'GET',
    url: '/hcps/',
  };

  return axios(config);
}

export function getHCP(id) {
  const config = {
    method: 'GET',
    url: `/hcps/${id}/`,
  };

  return axios(config);
}

export function postHCP(hcp) {
  const config = {
    method: 'POST',
    url: '/hcps/',
    data: hcp,
  };

  return axios(config);
}
