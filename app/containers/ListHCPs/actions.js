import { makeActionCreators } from 'utils/actions';

export const listHCPsActions = makeActionCreators('LIST_HCPS', {
  request: (limit, offset) => ({ limit, offset }), // NOTE: unused params, pagination not yet implemented
  success: (hcps) => ({ hcps }),
  error: (message) => ({ message }),
});
