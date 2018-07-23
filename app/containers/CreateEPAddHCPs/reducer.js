import { fromJS, List } from 'immutable';
import {
  searchHCPsActions,
  fetchHCPActions,
} from './actions';


const initialState = fromJS({
  serverError: '',
  hcps: new List(),
});

function createEPAddHcpsReducer(state = initialState, action) {
  switch (action.type) {
    case searchHCPsActions.success.type:
      return state.merge({ hcps: action.hcps });

    case fetchHCPActions.success.type:
      return state.merge({ hcp: action.hcp });

    default:
      return state;
  }
}

export default createEPAddHcpsReducer;
