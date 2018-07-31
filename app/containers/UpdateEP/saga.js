import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { setLoading } from 'containers/App/actions';
import { patchEngagementPlan, getEngagementPlan } from 'api/engagementPlans';
import * as actions from './actions';

function* updateEPSaga({ engagementPlan }) {
  try {
    const res = yield call(
      patchEngagementPlan,
      engagementPlan.get('id'),
      engagementPlan.toApiData()
    );
    yield put(actions.updateEPActions.success({ engagementPlan: res.data }));
    yield put(push('/'));
  } catch (error) {
    yield put(actions.updateEPActions.error(error.message));
  }
}

function* fetchEPSaga({ engagementPlanId }) {
  yield put(setLoading(true));
  try {
    const res = yield call(getEngagementPlan, engagementPlanId);
    yield put(actions.fetchEPActions.success(res.data));
  } catch (error) {
    yield put(actions.fetchEPActions.error(error.message));
  }
  yield put(setLoading(false));
}

export default function* createEPRootSage() {
  yield takeLatest(actions.fetchEPActions.request.type, fetchEPSaga);
  yield takeLatest(actions.updateEPActions.request.type, updateEPSaga);
}
