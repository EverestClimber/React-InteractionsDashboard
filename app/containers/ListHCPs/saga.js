import { List } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getInteractions } from 'api/interactions';
import { setLoading } from 'containers/App/actions';
import HCP from 'records/HCP';
import { listHCPsActions } from './actions';

function* listHCPsSaga(/* { limit, offset }*/) {
  yield put(setLoading(true));
  try {
    const res = yield call(getInteractions);
    const interactions = new List(
      res.data.map((data) => HCP.fromApiData(data))
    );

    yield put(listHCPsActions.success(interactions));
  } catch (error) {
    yield put(listHCPsActions.error(error.message()));
  }
  yield put(setLoading(false));
}

export default function* listHCPsRootSaga() {
  yield takeLatest(listHCPsActions.request.type, listHCPsSaga);
}
