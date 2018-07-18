import { List } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getInteractions } from 'api/interactions';
import { setLoading } from 'containers/App/actions';
import Interaction from 'records/Interaction';
import { listInteractionsActions } from './actions';


function* listInteractionsSaga() {
  yield put(setLoading(true));
  try {
    const res = yield call(getInteractions);
    const interactions = new List(res.data.map(
      (data) => Interaction.fromApiData(data)
    ));

    yield put(listInteractionsActions.success(interactions));
  } catch (error) {
    yield put(listInteractionsActions.error(error.message()));
  }
  yield put(setLoading(false));
}


export default function* listInteractionsRootSaga() {
  yield takeLatest(listInteractionsActions.request.type, listInteractionsSaga);
}
