import axios from '../config';

export function getInteractions() {
  const config = {
    method: 'GET',
    url: '/interactions/',
  };

  return axios(config);
}

export function getInteractionOutcomes() {
  const config = {
    method: 'GET',
    url: '/interaction-outcomes/',
  };

  return axios(config);
}

export function postInteraction(interaction) {
  const config = {
    method: 'POST',
    url: '/interactions/',
    data: interaction,
  };

  return axios(config);
}

export function patchInteraction(interaction) {
  const config = {
    method: 'PATCH',
    url: '/interactions/',
    data: interaction,
  };

  return axios(config);
}
