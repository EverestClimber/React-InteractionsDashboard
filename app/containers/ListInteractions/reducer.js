import { fromJS, List } from 'immutable';
import {
  listInteractionsActions,
} from './actions';

const initialState = fromJS({
  serverError: null,
  interactions: new List(),
});


function listInteractionsReducer(state = initialState, action) {
  switch (action.type) {

    case listInteractionsActions.success.type:
      return state.merge({
        serverError: '',
        interactions: action.interactions,
      });

    case listInteractionsActions.error.type:
      window.scrollTo(0, 0);
      return state.merge({ serverError: action.message });

    default:
      return state;
  }
}

export default listInteractionsReducer;
