import { fromJS } from 'immutable';
import * as actions from './actions';

const initialState = fromJS({
  serverError: '',
  engagementPlan: null,
});

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case actions.updateEPActions.error.type:
      window.scrollTo(0, 0);
      return state.merge({ serverError: action.message });

    case actions.fetchEPActions.success.type:
      return state.set('engagementPlan', action.engagementPlan);

    default:
      return state;
  }
}

export default createEpReducer;
