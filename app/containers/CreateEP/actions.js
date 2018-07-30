import { makeActionCreator, makeActionCreators } from 'utils/actions';


export const fetchCreateEPRequiredDataActions = makeActionCreators(
  'CREATE_EP/FETCH_REQUIRED_DATA',
  {
    request: () => ({}),
    success: (payload) => ({ payload }), // payload : { bcsfs, projects, medicalPlanObjectives }
    error: (message) => ({ message }),
  }
);

export const searchHCPsActions = makeActionCreators(
  'CREATE_EP/SEARCH_HCPS',
  {
    request: (search) => ({ search }),
    success: (hcps) => ({ hcps }),
    error: (message) => ({ message }),
  }
);

export const fetchHCPActions = makeActionCreators(
  'CREATE_EP/FETCH_HCP',
  {
    request: (hcpId) => ({ hcpId }),
    success: (hcp) => ({ hcp }),
    error: (message) => ({ message }),
  }
);

export const selectHCPsAction = makeActionCreator(
  'CREATE_EP/SELECT_HCPS',
  (hcps) => ({ hcps }),
);

export const removeHCPAction = makeActionCreator(
  'CREATE_EP/REMOVE_HCP',
  (hcpId) => ({ hcpId }),
);

export const searchProjectsActions = makeActionCreators(
  'CREATE_EP/SEARCH_PROJECTS',
  {
    request: (search) => ({ search }),
    success: (projects) => ({ projects }),
    error: (message) => ({ message }),
  }
);

export const fetchProjectActions = makeActionCreators(
  'CREATE_EP/FETCH_PROJECT',
  {
    request: (projectId) => ({ projectId }),
    success: (project) => ({ project }),
    error: (message) => ({ message }),
  }
);

export const selectProjectsAction = makeActionCreator(
  'CREATE_EP/SELECT_PROJECTS',
  (projects) => ({ projects }),
);

export const removeProjectAction = makeActionCreator(
  'CREATE_EP/REMOVE_PROJECTS',
  (projectId) => ({ projectId }),
);

export const updateHCPItemAction = makeActionCreator(
  'CREATE_EP/UPDATE_HCP_ITEM',
  (hcpId, data) => ({ payload: { hcpId, data } }),
);

export const addHCPObjectiveAction = makeActionCreator(
  'CREATE_EP/ADD_HCP_OBJECTIVE',
  (hcpId) => ({ hcpId }),
);

export const updateHCPObjectiveAction = makeActionCreator(
  'CREATE_EP/UPDATE_HCP_OBJECTIVE',
  (hcpId, idx, data) => ({ payload: { hcpId, idx, data } }),
);

export const removeHCPObjectiveAction = makeActionCreator(
  'CREATE_EP/REMOVE_HCP_OBJECTIVE',
  (hcpId, idx) => ({ payload: { hcpId, idx } }),
);

export const addHCPObjectiveDeliverableAction = makeActionCreator(
  'CREATE_EP/ADD_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx) => ({ payload: { hcpId, objectiveIdx } }),
);

export const updateHCPObjectiveDeliverableAction = makeActionCreator(
  'CREATE_EP/UPDATE_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx, deliverableIdx, data) => (
    { payload: { hcpId, objectiveIdx, deliverableIdx, data } }
  ),
);

export const removeHCPObjectiveDeliverableAction = makeActionCreator(
  'CREATE_EP/REMOVE_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx, deliverableIdx) => (
    { payload: { hcpId, objectiveIdx, deliverableIdx } }
  ),
);