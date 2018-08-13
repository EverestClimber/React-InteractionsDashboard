import { fromJS } from 'immutable';
import * as actions from './actions';

const initialState = fromJS({
  serverError: '',
  engagementPlan: null,
});

function msluserDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchCurrentEPActions.success.type:
      return state.set('engagementPlan', action.engagementPlan);
    default:
      return state;
  }
}

export default msluserDashboardReducer;
