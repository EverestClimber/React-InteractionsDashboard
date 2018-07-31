import { makeActionCreator, makeActionCreators } from 'utils/actions';

export const setEPAction = makeActionCreator(
  'EP_FORM/SET_EP',
  (engagementPlan) => ({ engagementPlan })
);

export const fetchCreateEPRequiredDataActions = makeActionCreators(
  'EP_FORM/FETCH_REQUIRED_DATA',
  {
    request: () => ({}),
    success: (payload) => ({ payload }), // payload : { bcsfs, projects, medicalPlanObjectives }
    error: (message) => ({ message }),
  }
);

export const searchHCPsActions = makeActionCreators('EP_FORM/SEARCH_HCPS', {
  request: (search) => ({ search }),
  success: (hcps) => ({ hcps }),
  error: (message) => ({ message }),
});

export const fetchHCPActions = makeActionCreators('EP_FORM/FETCH_HCP', {
  request: (hcpId) => ({ hcpId }),
  success: (hcp) => ({ hcp }),
  error: (message) => ({ message }),
});

export const selectHCPsAction = makeActionCreator(
  'EP_FORM/SELECT_HCPS',
  (hcps) => ({ hcps })
);

export const removeHCPAction = makeActionCreator(
  'EP_FORM/REMOVE_HCP',
  (hcpId) => ({ hcpId })
);

export const searchProjectsActions = makeActionCreators(
  'EP_FORM/SEARCH_PROJECTS',
  {
    request: (search) => ({ search }),
    success: (projects) => ({ projects }),
    error: (message) => ({ message }),
  }
);

export const fetchProjectActions = makeActionCreators('EP_FORM/FETCH_PROJECT', {
  request: (projectId) => ({ projectId }),
  success: (project) => ({ project }),
  error: (message) => ({ message }),
});

export const selectProjectsAction = makeActionCreator(
  'EP_FORM/SELECT_PROJECTS',
  (projects) => ({ projects })
);

export const removeProjectAction = makeActionCreator(
  'EP_FORM/REMOVE_PROJECTS',
  (projectId) => ({ projectId })
);

export const updateHCPItemAction = makeActionCreator(
  'EP_FORM/UPDATE_HCP_ITEM',
  (hcpId, data) => ({ payload: { hcpId, data } })
);

export const addHCPObjectiveAction = makeActionCreator(
  'EP_FORM/ADD_HCP_OBJECTIVE',
  (hcpId) => ({ hcpId })
);

export const updateHCPObjectiveAction = makeActionCreator(
  'EP_FORM/UPDATE_HCP_OBJECTIVE',
  (hcpId, idx, data) => ({ payload: { hcpId, idx, data } })
);

export const removeHCPObjectiveAction = makeActionCreator(
  'EP_FORM/REMOVE_HCP_OBJECTIVE',
  (hcpId, idx) => ({ payload: { hcpId, idx } })
);

export const addHCPObjectiveDeliverableAction = makeActionCreator(
  'EP_FORM/ADD_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx) => ({ payload: { hcpId, objectiveIdx } })
);

export const updateHCPObjectiveDeliverableAction = makeActionCreator(
  'EP_FORM/UPDATE_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx, deliverableIdx, data) => ({
    payload: { hcpId, objectiveIdx, deliverableIdx, data },
  })
);

export const removeHCPObjectiveDeliverableAction = makeActionCreator(
  'EP_FORM/REMOVE_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx, deliverableIdx) => ({
    payload: { hcpId, objectiveIdx, deliverableIdx },
  })
);

export const updateProjectItemAction = makeActionCreator(
  'EP_FORM/UPDATE_PROJECT_ITEM',
  (projectId, data) => ({ payload: { projectId, data } })
);

export const addProjectObjectiveAction = makeActionCreator(
  'EP_FORM/ADD_PROJECT_OBJECTIVE',
  (projectId) => ({ projectId })
);

export const updateProjectObjectiveAction = makeActionCreator(
  'EP_FORM/UPDATE_PROJECT_OBJECTIVE',
  (projectId, idx, data) => ({ payload: { projectId, idx, data } })
);

export const removeProjectObjectiveAction = makeActionCreator(
  'EP_FORM/REMOVE_PROJECT_OBJECTIVE',
  (projectId, idx) => ({ payload: { projectId, idx } })
);

export const addProjectObjectiveDeliverableAction = makeActionCreator(
  'EP_FORM/ADD_PROJECT_OBJECTIVE_DELIVERABLE',
  (projectId, objectiveIdx) => ({ payload: { projectId, objectiveIdx } })
);

export const updateProjectObjectiveDeliverableAction = makeActionCreator(
  'EP_FORM/UPDATE_PROJECT_OBJECTIVE_DELIVERABLE',
  (projectId, objectiveIdx, deliverableIdx, data) => ({
    payload: { projectId, objectiveIdx, deliverableIdx, data },
  })
);

export const removeProjectObjectiveDeliverableAction = makeActionCreator(
  'EP_FORM/REMOVE_PROJECT_OBJECTIVE_DELIVERABLE',
  (projectId, objectiveIdx, deliverableIdx) => ({
    payload: { projectId, objectiveIdx, deliverableIdx },
  })
);
