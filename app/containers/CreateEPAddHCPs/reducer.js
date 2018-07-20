import { fromJS, List, OrderedMap } from 'immutable';


const initialState = fromJS({
  serverError: '',
  hcps: new List(),
  selectedHCPs: new OrderedMap(),
});

function createEpaddHcpsReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default createEpaddHcpsReducer;
