import axios from './config';


export function getHCPs(params) {
  const config = {
    method: 'GET',
    url: '/hcps/',
    params,
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

export function getHCPObjectives(params) {
  const config = {
    method: 'GET',
    url: '/hcp-objectives/',
    params,
  };

  return axios(config);
}
