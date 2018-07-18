import { makeActionCreators } from 'utils/actions';


export const listInteractionsActions = makeActionCreators(
  'LIST_INTERACTIONS',
  {
    request: () => ({}),
    success: (interactions) => ({ interactions }),
    error: (message) => ({ message }),
  }
);
