
import { fromJS } from 'immutable';
import recordInteractionReducer from '../reducer';

describe('recordInteractionReducer', () => {
  it('returns the initial state', () => {
    expect(recordInteractionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
