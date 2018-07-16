import { takeLatest, call, select, put } from 'redux-saga/effects';
import { List } from 'immutable';

import HCP from 'records/HCP';
import Project from 'records/Project';
import Resource from 'records/Resource';
import { HCPObjective } from 'records/HCPObjective';
import { getResources } from 'api/resources';
import { getProjects } from 'api/projects';
import {
  getHCP,
  getHCPs,
  getHCPObjectives,
} from 'api/hcps';
import { postInteraction } from 'api/interactions';
import { selectGlobal } from 'containers/App/selectors';

import {
  fetchInteractionRecordingRequiredDataActions,
  searchHCPsActions,
  fetchHCPObjectivesActions,
  recordInteractionActions,
  fetchHCPActions,
} from './actions';
import { setLoading } from '../App/actions';


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


function* searchHCPsSaga({ search }) {
  try {
    const res = yield call(getHCPs, { search });

    const globalState = yield select(selectGlobal);
    const tasById = globalState.get('therapeuticAreas');
    const affiliateGroupsById = globalState.get('affiliateGroups');

    const hcps = new List(res.data.map(
      (hcpData) => HCP.fromApiData(hcpData, tasById, affiliateGroupsById))
    );
    yield put(searchHCPsActions.success(hcps));

  } catch (error) {
    yield put(searchHCPsActions.error(error.message));
  }
}


function* fetchHCPSaga({ hcpId }) {
  if (!hcpId) {
    yield put(fetchHCPActions.success(null));
    return;
  }

  try {
    const res = yield call(getHCP, hcpId);

    const globalState = yield select(selectGlobal);
    const tasById = globalState.get('therapeuticAreas');
    const affiliateGroupsById = globalState.get('affiliateGroups');

    const hcp = HCP.fromApiData(res.data, tasById, affiliateGroupsById);
    yield put(fetchHCPActions.success(hcp));

  } catch (error) {
    yield put(fetchHCPActions.error(error.message));
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
  } catch (error) {
    yield put(recordInteractionActions.error(error.message));
  }
}


export default function* recordInteractionRootSaga() {
  yield takeLatest(
    fetchInteractionRecordingRequiredDataActions.request.type,
    fetchInteractionRecordingRequiredDataSaga
  );
  yield takeLatest(searchHCPsActions.request.type, searchHCPsSaga);
  yield takeLatest(fetchHCPActions.request.type, fetchHCPSaga);
  yield takeLatest(fetchHCPObjectivesActions.request.type, fetchHCPObjectivesSaga);
  yield takeLatest(recordInteractionActions.request.type, recordInteractionSaga);
}
