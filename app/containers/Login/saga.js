import { takeLatest, call, put } from 'redux-saga/effects';
import jwt from 'jsonwebtoken';
import { push } from 'react-router-redux';

import User from 'records/user';
import { obtainToken } from '../../api/auth';
import { loginActionTypes } from './constants';
import { loginActions } from './actions';
import { setUser } from '../App/actions';

function* setTokenSaga(token) {
  const user = new User(jwt.decode(token));

  localStorage.setItem('token', token);

  yield put(setUser(user));
}

function* loginSaga(action) {
  const { payload } = action;
  try {
    const response = yield call(obtainToken, payload.email, payload.password);
    const token = response.data.token;

    yield call(setTokenSaga, token);
    // yield put(loginActions.success());
    yield put(push('/'));
  } catch (error) {
    yield put(loginActions.error(error.message));
  }
}

export default function* loginRootSaga() {
  yield takeLatest(loginActionTypes.request, loginSaga);
}
