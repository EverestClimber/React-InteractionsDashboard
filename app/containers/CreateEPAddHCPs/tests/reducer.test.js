
import { fromJS } from 'immutable';
import createEpaddHcpsReducer from '../reducer';

describe('createEpaddHcpsReducer', () => {
  it('returns the initial state', () => {
    expect(createEpaddHcpsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
