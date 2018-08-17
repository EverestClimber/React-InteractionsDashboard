import { SET_USER, LOADING, REFRESH_TOKEN, LOGOUT } from './constants';
import { makeActionCreators, makeActionCreator } from '../../utils/actions';

export const setUser = (user) => ({ type: SET_USER, payload: { user } });
export const setLoading = (loading) => ({ type: LOADING, loading });
export const refreshToken = () => ({ type: REFRESH_TOKEN });
export const logout = () => ({ type: LOGOUT });

export const getCurrentUserActions = makeActionCreators('GET_CURRENT_USER', {
  request: () => ({}),
  error: (message) => ({ message }),
});

export const fetchCommonDataActions = makeActionCreators('FETCH_COMMON_DATA', {
  request: () => ({}),
  success: (payload) => ({ payload }),
  error: (message) => ({ message }),
});

export const setFlashMessage = makeActionCreator(
  'SET_FLASH_MESSAGE',
  (text, type) => ({ payload: { text, type } })
);
