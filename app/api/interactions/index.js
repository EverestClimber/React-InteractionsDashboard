import axios from '../config';

export function getInteractions() {
  const config = {
    method: 'GET',
    url: '/interactions/',
  };

  return axios(config);
}

export function postInteraction(user) {
  const config = {
    method: 'GET',
    url: '/interactions/',
    data: { user },
  };

  return axios(config);
}
