import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { LOGOUT } from './constants';
import { postRefreshToken } from '../../api/auth';

function* refreshTokenSaga() {
  const token = localStorage.getItem('token');

  try {
    const response = yield call(postRefreshToken, token);
    const authToken = response.data.token;

    localStorage.setItem('token', authToken);
  } catch (error) {
    yield call(logoutSaga);
  }
}

function* logoutSaga() {
  localStorage.removeItem('token');

  yield put(push('/login'));
}

export default function* appRootSaga() {
  yield takeEvery(LOGOUT, logoutSaga);
}
