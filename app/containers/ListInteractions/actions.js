import { makeActionCreators } from 'utils/actions';

export const listInteractionsActions = makeActionCreators('LIST_INTERACTIONS', {
  request: (limit, offset) => ({ limit, offset }),
  success: (interactions) => ({ interactions }),
  error: (message) => ({ message }),
});
