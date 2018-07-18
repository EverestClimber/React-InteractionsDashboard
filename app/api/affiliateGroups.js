import axios from './config';


export function getAffiliateGroups() {
  return axios({
    method: 'GET',
    url: '/affiliate-groups/',
  });
}
