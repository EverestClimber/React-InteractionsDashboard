import { fromJS, List } from 'immutable';
import {
  recordInteractionActions,
  fetchInteractionRecordingRequiredDataActions,
} from './actions';


const initialState = fromJS({
  serverError: '',
  hcps: new List(),
  hcpObjectives: new List(),
  projects: new List(),
  resources: new List(),
});

function recordInteractionReducer(state = initialState, action) {
  switch (action.type) {
    case fetchInteractionRecordingRequiredDataActions.success.type: {
      const {
        projects,
        resources,
      } = action.payload;
      return state.merge({
        projects,
        resources,
      });
    }

    case recordInteractionActions.error.type: {
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
