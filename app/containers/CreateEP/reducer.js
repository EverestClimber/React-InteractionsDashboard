import { fromJS } from 'immutable';
import * as actions from './actions';

const initialState = fromJS({
  serverError: '',
});

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case actions.createEPActions.error.type:
      window.scrollTo(0, 0);
      return state.merge({ serverError: action.message });

    default:
      return state;
  }
}

export default createEpReducer;
