import axios from '../config';

export function getTherapeuticAreas() {
  const config = {
    method: 'GET',
    url: '/therapeutic-areas/',
  };

  return axios(config);
}
