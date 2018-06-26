import { fromJS, Map } from 'immutable';

import User from 'records/user';
import { SET_USER, LOGOUT, LOADING } from './constants';

const initialState = new Map({
  user: new User(),
  ui: fromJS({
    loading: false,
  }),
});

// { type: SOME_ACTION, payload: 'test' }
function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return state.set('user', action.payload.user);

    case LOGOUT:
      return state.set('user', null);

    case LOADING:
      return state.updateIn(['ui', 'loading'], () => action.loading);

    default:
      return state;
  }
}

export default appReducer;
