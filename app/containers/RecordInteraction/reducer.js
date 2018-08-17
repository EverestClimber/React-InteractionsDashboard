import { fromJS, List } from 'immutable';
import {
  fetchInteractionRecordingRequiredDataActions,
  fetchHCPObjectivesActions,
  recordInteractionActions,
  searchHCPsActions,
  fetchHCPActions,
  setSuccessAction,
} from './actions';

const initialState = fromJS({
  serverError: null,
  hcp: null,
  hcps: new List(),
  hcpObjectives: new List(),
  projects: new List(),
  resources: new List(),
  success: false,
});

function recordInteractionReducer(state = initialState, action) {
  switch (action.type) {
    case fetchInteractionRecordingRequiredDataActions.success.type: {
      const { projects, resources } = action.payload;
      return state.merge({
        projects,
        resources,
      });
    }

    case recordInteractionActions.error.type: {
      window.scrollTo(0, 0);
      return state.merge({ serverError: action.message });
    }

    case recordInteractionActions.success.type: {
      return initialState;
    }

    case searchHCPsActions.success.type:
      return state.merge({ hcps: action.hcps });

    case fetchHCPActions.success.type:
      return state.merge({ hcp: action.hcp });

    case fetchHCPObjectivesActions.success.type:
      return state.merge({ hcpObjectives: action.hcpObjectives });

    case setSuccessAction.type:
      return state.set('success', action.success);

    default:
      return state;
  }
}

export default recordInteractionReducer;
