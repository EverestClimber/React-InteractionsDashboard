import { makeActionCreator } from 'utils/actions';


export const selectHCPsAction = makeActionCreator(
  'CREATE_EP/SELECT_HCPS',
  (hcps) => ({ hcps }),
);


export const removeHCPAction = makeActionCreator(
  'CREATE_EP/REMOVE_HCP',
  (hcpId) => ({ hcpId }),
);
