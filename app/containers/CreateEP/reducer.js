/*
 *
 * CreateEp reducer
 *
 */

import { fromJS, List } from 'immutable';

const initialState = fromJS({
  serverError: '',
  hcpObjectives: new List(),
  projectObjectives: new List(),
});

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default createEpReducer;
