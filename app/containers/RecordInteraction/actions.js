import { makeActionCreators } from 'utils/actions';


export const recordInteractionActions = makeActionCreators('RECORD_INTERACTION', {
  request: (interaction) => ({ interaction }),
  success: () => ({}),
  error: (message) => ({ message }),
});


export const searchHCPActions = makeActionCreators(
  'RECORD_INTERACTION/SEARCH_HCPS',
  {
    request: (search) => ({ search }),
    success: (hcps) => ({ hcps }),
    error: (message) => ({ message }),
  }
);


export const fetchInteractionRecordingRequiredDataActions = makeActionCreators(
  'RECORD_INTERACTION/FETCH_REQUIRED_DATA',
  {
    request: () => ({}),
    success: (payload) => ({ payload }), // payload : { projects, resources }
    error: (message) => ({ message }),
  }
);


export const fetchHCPObjectivesActions = makeActionCreators(
  'RECORD_INTERACTION/FETCH_HCPOBJECTIVES',
  {
    request: (hcpId) => ({ hcpId }),
    success: (hcpObjectives) => ({ hcpObjectives }),
    error: (message) => ({ message }),
  }
);
