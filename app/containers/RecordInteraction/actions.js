import {
  fetchInteractionActionTypes,
  recordInteractionActionTypes,
} from './constants';


export const fetchInteractionActions = {
  request: (userId) => ({
    type: fetchInteractionActionTypes.request,
    userId,
  }),
  // payload - { hcps, hcpObjectives, projects, resources, outcomes }
  success: (payload) => ({
    type: fetchInteractionActionTypes.success,
    payload,
  }),
  error: (message) => ({
    type: fetchInteractionActionTypes.error,
    message,
  }),
};

export const recordInteractionActions = {
  request: (interaction) => ({
    type: recordInteractionActionTypes.request,
    interaction,
  }),
  success: () => ({
    type: recordInteractionActionTypes.success,
  }),
  error: (message) => ({
    type: recordInteractionActionTypes.error,
    message,
  }),
};
