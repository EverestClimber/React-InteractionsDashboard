import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { postPasswordResetConfirm } from 'api/auth';
import { setLoading, setFlashMessage } from 'containers/App/actions';
import * as actions from './actions';

function* passwordResetConfirmSaga({
  payload: { uid, token, new_password1, new_password2 },
}) {
  yield put(setLoading(true));
  try {
    yield call(
      postPasswordResetConfirm,
      uid,
      token,
      new_password1,
      new_password2
    );
    yield put(push('/login'));
  } catch (error) {
    yield put(actions.passwordResetConfirmActions.error(error.message));
    yield put(
      setFlashMessage('An error has occurred. Please try again later.', 'error')
    );
  }
  yield put(setLoading(false));
}

export default function* passwordResetConfirmRootSaga() {
  yield takeLatest(
    actions.passwordResetConfirmActions.request.type,
    passwordResetConfirmSaga
  );
}
