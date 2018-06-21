import { loginActionTypes } from './constants';

export const loginActions = {
  request: (email, password) => ({
    type: loginActionTypes.request,
    payload: { email, password },
  }),
  success: () => ({
    type: loginActionTypes.success,
  }),
  error: (message) => ({
    type: loginActionTypes.error,
    payload: { message },
  }),
};
