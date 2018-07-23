import { makeActionCreator } from 'utils/actions';


export const selectHCPsAction = makeActionCreator(
  'CREATE_EP/SELECT_HCPS',
  (hcps) => ({ hcps }),
);

export const removeHCPAction = makeActionCreator(
  'CREATE_EP/REMOVE_HCP',
  (hcpId) => ({ hcpId }),
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
  'CREATE_EP/UPDATE_HCP_OBJECTIVE_DELIVERABLE',
  (hcpId, objectiveIdx, deliverableIdx) => (
    { payload: { hcpId, objectiveIdx, deliverableIdx } }
  ),
);
