import axios from './config';


export function getSelf() {
  return axios({
    method: 'GET',
    url: '/self/',
  });
}
