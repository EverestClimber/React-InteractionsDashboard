import { fromJS, List } from 'immutable';
import {
  fetchInteractionActionTypes,
  recordInteractionActionTypes,
} from './constants';


const initialState = fromJS({
  serverError: '',
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
    case recordInteractionActionTypes.error: {
      window.scrollTo(0, 0);
      return state.merge({
        serverError: action.message,
      });
    }
    default:
      return state;
  }
}

export default recordInteractionReducer;
