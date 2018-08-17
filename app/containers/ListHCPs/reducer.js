import { fromJS, List } from 'immutable';
import { listHCPsActions } from './actions';

const initialState = fromJS({
  serverError: null,
  hcps: new List(),
});

function listHCPsReducer(state = initialState, action) {
  switch (action.type) {
    case listHCPsActions.success.type:
      return state.merge({
        serverError: '',
        interactions: action.interactions,
      });

    case listHCPsActions.error.type:
      window.scrollTo(0, 0);
      return state.merge({ serverError: action.message });

    default:
      return state;
  }
}

export default listHCPsReducer;
