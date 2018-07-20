import { takeLatest } from 'redux-saga/effects';
import { makeFetchHCPSaga, makeSearchHCPsSaga } from 'containers/App/saga';
import { fetchHCPActions, searchHCPsActions } from './actions';


export default function* createEPAddHCPsRootSage() {
  yield takeLatest(
    searchHCPsActions.request.type,
    makeSearchHCPsSaga(searchHCPsActions.success, searchHCPsActions.error)
  );
  yield takeLatest(
    fetchHCPActions.request.type,
    makeFetchHCPSaga(fetchHCPActions.success, fetchHCPActions.error)
  );
}
