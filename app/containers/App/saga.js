import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import User from 'records/user';
import { getSelf, postRefreshToken } from 'api/auth';
import { LOGOUT, REFRESH_TOKEN } from './constants';
import { setUser, setLoading } from './actions';

function* refreshTokenSaga() {
  const token = localStorage.getItem('token');

  try {
    if (token) {
      const response = yield call(postRefreshToken, token);
      const authToken = response.data.token;

      localStorage.setItem('token', authToken);
    }
  } catch (error) {
    yield call(logoutSaga);
  }
}

function* getCurrentUserSaga() {
  const token = localStorage.getItem('token');

  if (token) {
    yield put(setLoading(true));

    try {
      const response = yield call(getSelf, token);

      const user = new User(response.data);
      yield put(setUser(user));

      yield put(setLoading(false));
    } catch (error) {
      yield put(setLoading(false));
    }
  }
}

function* logoutSaga() {
  localStorage.removeItem('token');

  yield put(push('/login'));
}

export default function* appRootSaga() {
  yield call(getCurrentUserSaga);

  yield takeEvery(REFRESH_TOKEN, refreshTokenSaga);
  yield takeEvery(LOGOUT, logoutSaga);
}
