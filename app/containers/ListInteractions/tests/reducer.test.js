
import { fromJS } from 'immutable';
import listInteractionsReducer from '../reducer';

describe('listInteractionsReducer', () => {
  it('returns the initial state', () => {
    expect(listInteractionsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
