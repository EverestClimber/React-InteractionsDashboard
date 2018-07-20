import { fromJS, List, OrderedMap } from 'immutable';
import {
  searchHCPsActions,
  fetchHCPActions,
  selectHCPsAction,
} from './actions';


const initialState = fromJS({
  serverError: '',
  hcps: new List(),
  selectedHCPs: new OrderedMap(),
});

function createEPAddHcpsReducer(state = initialState, action) {
  switch (action.type) {
    case searchHCPsActions.success.type:
      return state.merge({ hcps: action.hcps });

    case fetchHCPActions.success.type:
      return state.merge({ hcp: action.hcp });

    case selectHCPsAction.type:
      return state.set('selectedHCPs', action.hcps);

    default:
      return state;
  }
}

export default createEPAddHcpsReducer;
