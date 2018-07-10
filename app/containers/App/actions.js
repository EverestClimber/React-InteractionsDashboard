import {
  SET_USER,
  LOADING,
  REFRESH_TOKEN,
  LOGOUT,
  fetchCommonDataActionTypes,
} from './constants';


export const setUser = (user) => ({ type: SET_USER, payload: { user } });
export const setLoading = (loading) => ({ type: LOADING, loading });
export const refreshToken = () => ({ type: REFRESH_TOKEN });
export const logout = () => ({ type: LOGOUT });

export const fetchCommonDataActions = {
  request: () => ({
    type: fetchCommonDataActionTypes.request,
  }),
  success: (payload) => ({
    type: fetchCommonDataActionTypes.success,
    payload,
  }),
  error: (message) => ({
    type: fetchCommonDataActionTypes.error,
    message,
  }),
};
