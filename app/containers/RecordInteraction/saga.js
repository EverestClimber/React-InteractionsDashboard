import { takeLatest, call, put } from 'redux-saga/effects';
import { List, Map } from 'immutable';

import HCP from 'records/hcp';
import Project from 'records/project';
import Objective from 'records/objective';
import { getResources } from 'api/resources';
import { getProjects } from 'api/projects';
import { getHCPs, getHCPObjectives } from 'api/hcps';
import { postInteraction } from 'api/interactions';
import {
  fetchInteractionActionTypes,
  recordInteractionActionTypes,
} from './constants';
import {
  fetchInteractionActions,
  recordInteractionActions,
} from './actions';
import { setLoading } from '../App/actions';


function* fetchRecordIntegrationSaga(action) {  // eslint-disable-line
  // const { userId } = action;
  // const query = { user: userId };

  yield put(setLoading(true));

  try {
    const [
      hcpsResponse,
      hcpObjectivesResponse,
      resourcesResponse,
      projectsResponse,
    ] = yield [
      // call(getHCPs, query),
      call(getHCPs),
      call(getHCPObjectives),
      call(getResources),
      call(getProjects),
    ];

    const interaction = {
      hcps: new List(hcpsResponse.data.map(
        (hcp) => HCP.fromApiObject(hcp))
      ),
      hcpObjectives: new List(hcpObjectivesResponse.data.map(
        (objective) => Objective.fromApiObject(objective)
      )),
      resources: new List(resourcesResponse.data.map(
        (resource) => new Map(resource))
      ),
      projects: new List(projectsResponse.data.map(
        (project) => Project.fromApiObject(project))
      ),
    };

    yield put(setLoading(false));
    yield put(fetchInteractionActions.success(interaction));
  } catch (error) {
    console.log('=== API error:', error);
    yield put(fetchInteractionActions.error(error.message));
    yield put(setLoading(false));
  }
}

function* recordInteractionSaga(action) {
  const { interaction } = action;
  try {
    yield call(postInteraction, interaction.toApiData());
    yield put(recordInteractionActions.success());
  } catch (error) {
    yield put(recordInteractionActions.error(error.message));
  }
}

export default function* recordInteractionRootSaga() {
  yield takeLatest(fetchInteractionActionTypes.request, fetchRecordIntegrationSaga);
  yield takeLatest(recordInteractionActionTypes.request, recordInteractionSaga);
}
