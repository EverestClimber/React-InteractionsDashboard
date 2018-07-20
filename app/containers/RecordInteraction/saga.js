import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { List } from 'immutable';

import Project from 'records/Project';
import Resource from 'records/Resource';
import { HCPObjective } from 'records/HCPObjective';
import { getResources } from 'api/resources';
import { getProjects } from 'api/projects';
import {
  getHCPObjectives,
} from 'api/hcps';
import { postInteraction } from 'api/interactions';
import { makeFetchHCPSaga, makeSearchHCPsSaga } from 'containers/App/saga';
import { setLoading } from 'containers/App/actions';
import {
  fetchInteractionRecordingRequiredDataActions,
  fetchHCPObjectivesActions,
  recordInteractionActions,
  fetchHCPActions,
  searchHCPsActions,
} from './actions';


function* fetchInteractionRecordingRequiredDataSaga() {
  yield put(setLoading(true));

  try {
    const [
      resourcesResponse,
      projectsResponse,
    ] = yield [
      call(getResources),
      call(getProjects),
    ];

    const payload = {
      resources: new List(resourcesResponse.data.map(
        (resourceData) => Resource.fromApiData(resourceData)
      )),
      projects: new List(projectsResponse.data.map(
        (projectData) => Project.fromApiData(projectData)
      )),
    };

    yield put(setLoading(false));
    yield put(fetchInteractionRecordingRequiredDataActions.success(payload));

  } catch (error) {
    yield put(fetchInteractionRecordingRequiredDataActions.error(error.message));
    yield put(setLoading(false));
  }
}


function* fetchHCPObjectivesSaga({ hcpId }) {
  if (!hcpId) {
    yield put(fetchHCPObjectivesActions.success(new List()));
    return;
  }

  try {
    const res = yield call(getHCPObjectives, { hcp: hcpId });
    const hcpObjectives = new List(res.data.map(
      (objectiveData) => HCPObjective.fromApiData(objectiveData)
    ));

    yield put(fetchHCPObjectivesActions.success(hcpObjectives));

  } catch (error) {
    yield put(fetchHCPObjectivesActions.error(error.message));
  }
}


function* recordInteractionSaga({ interaction }) {
  try {
    yield call(postInteraction, interaction.toApiData());
    yield put(recordInteractionActions.success());
    yield put(push('/'));
  } catch (error) {
    yield put(recordInteractionActions.error(error.message));
  }
}


export default function* recordInteractionRootSaga() {
  yield takeLatest(
    fetchInteractionRecordingRequiredDataActions.request.type,
    fetchInteractionRecordingRequiredDataSaga
  );
  yield takeLatest(fetchHCPObjectivesActions.request.type, fetchHCPObjectivesSaga);
  yield takeLatest(recordInteractionActions.request.type, recordInteractionSaga);
  yield takeLatest(
    searchHCPsActions.request.type,
    makeSearchHCPsSaga(searchHCPsActions.success, searchHCPsActions.error)
  );
  yield takeLatest(
    fetchHCPActions.request.type,
    makeFetchHCPSaga(fetchHCPActions.success, fetchHCPActions.error)
  );
}
