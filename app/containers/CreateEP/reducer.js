import { fromJS } from 'immutable';
import { EngagementPlan } from 'records/EngagementPlan';


const initialState = fromJS({
  serverError: '',
  engagementPlan: new EngagementPlan(),
});

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default createEpReducer;
