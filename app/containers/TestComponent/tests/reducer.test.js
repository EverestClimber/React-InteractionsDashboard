
import { fromJS } from 'immutable';
import testComponentReducer from '../reducer';

describe('testComponentReducer', () => {
  it('returns the initial state', () => {
    expect(testComponentReducer(undefined, {})).toEqual(fromJS({}));
  });
});
