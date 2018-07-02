import { fromJS, List } from 'immutable';
import {
  fetchInteractionActionTypes,
} from './constants';

const initialState = fromJS({
  hcps: new List(),
  hcpObjectives: new List(),
  projects: new List(),
  resources: new List(),
  outcomes: new List(),
});

function recordInteractionReducer(state = initialState, action) {
  switch (action.type) {
    case fetchInteractionActionTypes.success: {
      const {
        hcps,
        hcpObjectives,
        projects,
        resources,
        outcomes,
      } = action.payload;
      return state.merge({
        hcps,
        hcpObjectives,
        projects,
        resources,
        outcomes,
      });
    }
    default:
      return state;
  }
}

export default recordInteractionReducer;
