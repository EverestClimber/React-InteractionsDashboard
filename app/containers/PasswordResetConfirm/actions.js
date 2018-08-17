import { makeActionCreators } from 'utils/actions';

export const passwordResetConfirmActions = makeActionCreators(
  'PASSWORD_RESET_CONFIRM',
  {
    request: (uid, token, new_password1, new_password2) => ({
      payload: { uid, token, new_password1, new_password2 },
    }),
    success: () => ({}),
    error: (message) => ({ message }),
  }
);
