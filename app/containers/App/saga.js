import { take, takeEvery, call, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { LOGOUT } from './constants';
import { refreshToken } from '../../api/auth';

function* refreshTokenSaga() {
  const token = localStorage.getItem('token');

  try {
    const response = yield call(refreshToken, token);

    localStorage.setItem('token', response.data.token);
  } catch (error) {
    yield call(logoutSaga);
  }
}

function* logoutSaga() {
  localStorage.removeItem('token');

  yield put(push('/login'));
}

function* refreshTokenInverval() {
  while (true) {
    yield call(refreshTokenSaga);

    yield take(LOGOUT);
    break;
  }
}

export default function* appRootSaga() {
  yield takeEvery(LOGOUT, logoutSaga);

  if (localStorage.getItem('token')) {
    yield fork(refreshTokenInverval);
  }
}
