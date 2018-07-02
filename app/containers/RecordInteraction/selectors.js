import { createSelector } from 'reselect';

/**
 * Direct selector to the recordInteraction state domain
 */
const selectRecordInteractionDomain = (state) => state.get('recordInteraction');

/**
 * Other specific selectors
 */


/**
 * Default selector used by RecordInteraction
 */

const makeSelectRecordInteraction = () => createSelector(
  selectRecordInteractionDomain,
  (substate) => substate.toJS()
);

export default makeSelectRecordInteraction;
export {
  selectRecordInteractionDomain,
};
