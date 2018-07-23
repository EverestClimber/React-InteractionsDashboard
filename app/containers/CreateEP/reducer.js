import { fromJS, OrderedMap } from 'immutable';
import { EngagementPlan } from 'records/EngagementPlan';
import { removeHCPAction, selectHCPsAction } from './actions';


const initialState = fromJS({
  serverError: '',
  engagementPlan: new EngagementPlan(),
  selectedHCPs: new OrderedMap(),
});

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case selectHCPsAction.type:
      return state.set('selectedHCPs', action.hcps);

    case removeHCPAction.type:
      return state.merge({
        selectedHCPs: state.get('selectedHCPs').remove(action.hcpId),
      });

    default:
      return state;
  }
}

export default createEpReducer;
