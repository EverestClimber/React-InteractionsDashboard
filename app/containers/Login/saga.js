import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import User from 'records/user';
import { postObtainToken, getSelf } from '../../api/auth';
import { loginActionTypes } from './constants';
import { loginActions } from './actions';
import { setUser } from '../App/actions';

function* loginSaga(action) {
  const { payload } = action;
  try {
    const tokenResponse = yield call(postObtainToken, payload.email, payload.password);
    const token = tokenResponse.data.token;

    localStorage.setItem('token', token);

    const selfResponse = yield call(getSelf, token);

    const user = new User(selfResponse.data);
    yield put(setUser(user));

    yield put(push('/'));
  } catch (error) {
    yield put(loginActions.error(error.message));
  }
}

export default function* loginRootSaga() {
  yield takeLatest(loginActionTypes.request, loginSaga);
}
