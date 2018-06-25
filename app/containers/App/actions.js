import { SET_USER, LOADING, REFRESH_TOKEN } from './constants';

export const setUser = (user) => ({ type: SET_USER, payload: { user } });
export const setLoading = (loading) => ({ type: LOADING, loading });
export const refreshToken = () => ({ type: REFRESH_TOKEN });
