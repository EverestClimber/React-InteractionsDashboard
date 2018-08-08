import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { setLoading } from 'containers/App/actions';
import { selectGlobal } from 'containers/App/selectors';
import { patchEngagementPlan, getEngagementPlan } from 'api/engagementPlans';
import { EngagementPlan } from 'records/EngagementPlan';
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
    const globalState = yield select(selectGlobal);
    yield put(
      actions.fetchEPActions.success(
        EngagementPlan.fromApiData(
          res.data,
          globalState.get('therapeuticAreas'),
          globalState.get('affiliateGroups')
        )
      )
    );
  } catch (error) {
    yield put(actions.fetchEPActions.error(error.message));
  }
  yield put(setLoading(false));
}

export default function* createEPRootSage() {
  yield takeLatest(actions.fetchEPActions.request.type, fetchEPSaga);
  yield takeLatest(actions.updateEPActions.request.type, updateEPSaga);
}
