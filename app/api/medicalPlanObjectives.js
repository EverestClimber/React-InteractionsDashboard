import axios from './config';


export function getMedicalPlanObjectives() {
  return axios({
    method: 'GET',
    url: '/medical-plan-objectives/',
  });
}
