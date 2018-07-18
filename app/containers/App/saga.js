import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { List } from 'immutable';

import User from 'records/User';
import AffiliateGroup from 'records/AffiliateGroup';
import TherapeuticArea from 'records/TherapeuticArea';
import { postRefreshToken } from 'api/auth';
import { getSelf } from 'api/users';
import { getAffiliateGroups } from 'api/affiliateGroups';
import { getTherapeuticAreas } from 'api/therapeuticAreas';

import { LOGOUT, REFRESH_TOKEN } from './constants';
import {
  setLoading,
  setUser,
  getCurrentUserActions,
  fetchCommonDataActions,
} from './actions';


// const delay = (ms) => new Promise(res => setTimeout(res, ms));


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
      const user = User.fromApiData(response.data);

      yield put(setLoading(false));
      yield put(setUser(user));

    } catch (error) {
      yield put(getCurrentUserActions.error(error.message));
      yield put(setLoading(false));
    }
  }
}

function* getCommonDataSaga() {

  console.log('~~~ in getCommonDataSaga');

  yield put(setLoading(true));

  try {
    const [
      therapeuticAreasResponse,
      affiliateGroupsResponse,
    ] = yield [
      call(getTherapeuticAreas),
      call(getAffiliateGroups),
    ];

    const commonData = {
      therapeuticAreas: new List(therapeuticAreasResponse.data.map(
        (ta) => TherapeuticArea.fromApiData(ta)
      )),
      affiliateGroups: new List(affiliateGroupsResponse.data.map(
        (affiliateGroup) => AffiliateGroup.fromApiData(affiliateGroup)
      )),
    };

    yield put(setLoading(false));
    console.log('--- common data:', commonData);
    // yield delay(3000);
    yield put(fetchCommonDataActions.success(commonData));

  } catch (error) {
    yield put(fetchCommonDataActions.error(error.message));
    yield put(setLoading(false));
  }
}

function* logoutSaga() {
  localStorage.removeItem('token');

  yield put(push('/login'));
}

export default function* appRootSaga() {
  yield takeEvery(getCurrentUserActions.request.type, getCurrentUserSaga);
  yield takeEvery(fetchCommonDataActions.request.type, getCommonDataSaga);
  yield takeEvery(REFRESH_TOKEN, refreshTokenSaga);
  yield takeEvery(LOGOUT, logoutSaga);
}
