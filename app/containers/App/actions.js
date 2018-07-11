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


// const setAuserAction2 = makeAction('SET_USER2', (user) => ({
//   payload: user,
// }));

// make an action
// const a = setAuserAction2(user);
// access action type to match in reducer
// a.type;

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


// fetchCommonDataActions = makeActions('FETCH_COMMON_DATA', {
//   request: () => {},
//   success: (payload) => {payload},
//   error: (message) => {message},
// });
