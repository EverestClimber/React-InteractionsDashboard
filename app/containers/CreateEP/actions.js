import { makeActionCreators } from 'utils/actions';

export const createEPActions = makeActionCreators('CREATE_EP/CREATE_EP', {
  request: (engagementPlan) => ({ engagementPlan }),
  success: (engagementPlan) => ({ engagementPlan }),
  error: (message) => ({ message }),
});
