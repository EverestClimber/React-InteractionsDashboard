import { fromJS, Map, OrderedMap } from 'immutable';

import User from 'records/User';
import { SET_USER, LOGOUT, LOADING } from './constants';
import { fetchCommonDataActions } from './actions';


const initialState = new Map({
  user: new User(),
  ui: fromJS({
    loading: false,
  }),
  therapeuticAreas: new OrderedMap(),
  affiliateGroups: new OrderedMap(),
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return state.set('user', action.payload.user);

    case LOGOUT:
      return state.set('user', null);

    case LOADING:
      return state.updateIn(['ui', 'loading'], () => action.loading);

    case fetchCommonDataActions.success.type: {
      const { affiliateGroups, therapeuticAreas } = action.payload;
      const affiliateGroupsById = new OrderedMap(affiliateGroups.map((it) => [it.id, it]));
      const therapeuticAreasById = new OrderedMap(therapeuticAreas.map((it) => [it.id, it]));
      return state.merge({
        user: User.fromApiData(
          state.get('user').toApiData(),
          therapeuticAreasById,
          affiliateGroupsById
        ),
        affiliateGroups: affiliateGroupsById,
        therapeuticAreas: therapeuticAreasById,
      });
    }

    default:
      return state;
  }
}

export default appReducer;
