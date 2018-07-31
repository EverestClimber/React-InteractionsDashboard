import { makeActionCreators } from 'utils/actions';

export const fetchEPActions = makeActionCreators('UPDATE_EP/FETCH_EP', {
  request: (engagementPlanId) => ({ engagementPlanId }),
  success: (engagementPlan) => ({ engagementPlan }),
  error: (message) => ({ message }),
});

export const updateEPActions = makeActionCreators('UPDATE_EP/UPDATE_EP', {
  request: (engagementPlan) => ({ engagementPlan }),
  success: (engagementPlan) => ({ engagementPlan }),
  error: (message) => ({ message }),
});
