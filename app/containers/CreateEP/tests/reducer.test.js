
import { fromJS } from 'immutable';
import createEpReducer from '../reducer';

describe('createEpReducer', () => {
  it('returns the initial state', () => {
    expect(createEpReducer(undefined, {})).toEqual(fromJS({}));
  });
});
