import { fromJS } from 'immutable';

const initialState = fromJS({});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default loginReducer;
