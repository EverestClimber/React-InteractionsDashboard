import { takeLatest, call, put } from 'redux-saga/effects';

import { postPasswordReset } from 'api/auth';
import { setLoading, setFlashMessage } from 'containers/App/actions';
import * as actions from './actions';

function* passwordResetSaga({ email }) {
  yield put(setLoading(true));
  try {
    yield call(postPasswordReset, email);
    yield put(
      setFlashMessage(
        `An email with password reset instructions has been sent to ${email}.`,
        'success'
      )
    );
  } catch (error) {
    yield put(actions.passwordResetActions.error(error.message));
    yield put(
      setFlashMessage('An error has occurred. Please try again later.', 'error')
    );
  }
  yield put(setLoading(false));
}

export default function* passwordResetRootSaga() {
  yield takeLatest(
    actions.passwordResetActions.request.type,
    passwordResetSaga
  );
}
