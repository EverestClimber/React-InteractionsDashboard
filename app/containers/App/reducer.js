import { fromJS, Map, List } from 'immutable';

import User from 'records/user';
import { SET_USER, LOGOUT, LOADING, fetchCommonDataActionTypes } from './constants';


const initialState = new Map({
  user: new User(),
  ui: fromJS({
    loading: false,
  }),
  therapeuticAreas: new List(),
  affiliateGroups: new List(),
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return state.set('user', action.payload.user);

    case LOGOUT:
      return state.set('user', null);

    case LOADING:
      return state.updateIn(['ui', 'loading'], () => action.loading);

    case fetchCommonDataActionTypes.success: {
      const {
        affiliateGroups,
        therapeuticAreas,
      } = action.payload;
      return state.merge({
        affiliateGroups,
        therapeuticAreas,
      });
    }

    default:
      return state;
  }
}

export default appReducer;
