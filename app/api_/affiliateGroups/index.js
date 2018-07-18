import axios from '../config';

export function getAffiliateGroups() {
  const config = {
    method: 'GET',
    url: '/affiliate-groups/',
  };

  return axios(config);
}
