import { makeActionCreators } from 'utils/actions';
import {
  fetchInteractionActionTypes,
  recordInteractionActionTypes,
} from './constants';
// import makeSelectRecordInteraction from "./selectors";


export const fetchInteractionActions = {
  request: (userId, engagementPlanId, hcpId) => ({
    type: fetchInteractionActionTypes.request,
    userId,
    engagementPlanId,
    hcpId,
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


export const fetchHCPObjectives = makeActionCreators('FETCH_HCPOBJECTIVES', {
  request: (hcpId) => ({ hcpId }),
  success: (payload) => ({ payload }),
  error: (message) => ({ message }),
});
