import { createSelector } from 'reselect';

/**
 * Direct selector to the listInteractions state domain
 */
const selectListInteractionsDomain = (state) => state.get('listInteractions');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ListInteractions
 */

const makeSelectListInteractions = () => createSelector(
  selectListInteractionsDomain,
  (substate) => substate.toJS()
);

export default makeSelectListInteractions;
export {
  selectListInteractionsDomain,
};
