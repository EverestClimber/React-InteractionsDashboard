import axios from './config';


export function getBCSFs() {
  return axios({
    method: 'GET',
    url: '/brand-critical-success-factors/',
  });
}
