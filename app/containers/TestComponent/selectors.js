import { createSelector } from 'reselect';

/**
 * Direct selector to the testComponent state domain
 */
const selectTestComponentDomain = (state) => state.get('testComponent');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TestComponent
 */

const makeSelectTestComponent = () => createSelector(
  selectTestComponentDomain,
  (substate) => substate.toJS()
);

export default makeSelectTestComponent;
export {
  selectTestComponentDomain,
};
