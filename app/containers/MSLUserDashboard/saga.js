import { select, takeLatest, call, put } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
// import { List } from 'immutable';

import { setLoading } from 'containers/App/actions';
import { selectGlobal } from 'containers/App/selectors';
import { getEngagementPlan } from 'api/engagementPlans';
import { EngagementPlan } from 'records/EngagementPlan';
import * as actions from './actions';

function* fetchCurrentEPSaga({ engagementPlanId }) {
  yield put(setLoading(true));
  try {
    const res = yield call(getEngagementPlan, engagementPlanId);
    const globalState = yield select(selectGlobal);
    yield put(
      actions.fetchCurrentEPActions.success(
        EngagementPlan.fromApiData(
          res.data,
          globalState.get('therapeuticAreas'),
          globalState.get('affiliateGroups')
        )
      )
    );
  } catch (error) {
    yield put(actions.fetchCurrentEPActions.error(error.message));
  }
  yield put(setLoading(false));
}

// Individual exports for testing
export default function* mslUserDashboardRootSage() {
  yield takeLatest(
    actions.fetchCurrentEPActions.request.type,
    fetchCurrentEPSaga
  );
}
