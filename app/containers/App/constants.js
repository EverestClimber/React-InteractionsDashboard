import { createActionTypes } from 'utils/actions';


export const DEFAULT_LOCALE = 'en';

export const SET_USER = 'SET_USER';
export const LOADING = 'LOADING';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const LOGOUT = 'LOGOUT';

export const fetchCommonDataActionTypes = createActionTypes('fetch common data');
