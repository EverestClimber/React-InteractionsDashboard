import { makeActionCreators } from 'utils/actions';

export const passwordResetActions = makeActionCreators('PASSWORD_RESET', {
  request: (email) => ({ email }),
  success: () => ({}),
  error: (message) => ({ message }),
});
