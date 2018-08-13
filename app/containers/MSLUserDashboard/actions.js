import { makeActionCreators } from '../../utils/actions';

export const fetchCurrentEPActions = makeActionCreators('FETCH_CURRENT_EP', {
  request: () => ({}),
  success: (engagementPlan) => ({ engagementPlan }),
  error: (message) => ({ message }),
});
