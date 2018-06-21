import { fromJS } from 'immutable';

// import User from 'records/user';
import { SET_USER, LOGOUT } from './constants';

const initialState = fromJS({
  user: null,
  ui: fromJS({
    loading: false,
  }),
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return state.set('user', action.payload.user);

    case LOGOUT:
      return state.set('user', null);

    default:
      return state;
  }
}

export default appReducer;
