import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import User from 'records/User';
import { postObtainToken, getSelf } from '../../api/auth';
import { loginActionTypes } from './constants';
import { loginActions } from './actions';
import { setUser, setLoading } from '../App/actions';

function* loginSaga(action) {
  const { payload } = action;
  try {
    yield put(setLoading(true));

    const tokenResponse = yield call(postObtainToken, payload.email, payload.password);
    const token = tokenResponse.data.token;

    localStorage.setItem('token', token);

    const selfResponse = yield call(getSelf, token);

    const user = User.fromApiData(selfResponse.data);
    yield put(setUser(user));
    yield put(setLoading(false));

    yield put(push('/'));
  } catch (error) {
    yield put(setLoading(false));
    yield put(loginActions.error(error.message));
  }
}

export default function* loginRootSaga() {
  yield takeLatest(loginActionTypes.request, loginSaga);
}
