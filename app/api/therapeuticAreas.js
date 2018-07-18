import axios from './config';


export function getTherapeuticAreas() {
  return axios({
    method: 'GET',
    url: '/therapeutic-areas/',
  });
}
