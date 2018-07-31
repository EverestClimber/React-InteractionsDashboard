import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { postEngagementPlan } from 'api/engagementPlans';
import * as actions from './actions';

function* createEPSaga({ engagementPlan }) {
  try {
    const res = yield call(postEngagementPlan, engagementPlan.toApiData());
    yield put(actions.createEPActions.success({ engagementPlan: res }));
    yield put(push('/'));
  } catch (error) {
    yield put(actions.createEPActions.error(error.message));
  }
}

export default function* createEPRootSage() {
  yield takeLatest(actions.createEPActions.request.type, createEPSaga);
}
