import { fromJS } from 'immutable';

import appReducer from '../reducer';

describe('appReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({});
  });

  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(state);
  });
});
