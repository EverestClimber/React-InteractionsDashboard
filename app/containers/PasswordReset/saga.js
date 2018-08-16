import { takeLatest, call, put } from 'redux-saga/effects';

import { postPasswordReset } from 'api/auth';
import { setLoading } from 'containers/App/actions';
import * as actions from './actions';

function* passwordResetSaga({ email }) {
  yield put(setLoading(true));
  try {
    const r = yield call(postPasswordReset, email);
    console.log('--- password reset response:', r.data);
  } catch (error) {
    yield put(actions.passwordResetActions.error(error.message));
  }
  yield put(setLoading(false));
}

export default function* loginRootSaga() {
  yield takeLatest(actions.passwordResetActions.request, passwordResetSaga);
}
