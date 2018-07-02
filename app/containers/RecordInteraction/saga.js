import { takeLatest, call, put } from 'redux-saga/effects';
import { List, Map } from 'immutable';

import HCP from 'records/hcp';
import Project from 'records/project';
import Objective from 'records/objective';
import { getResources } from 'api/resources';
import { getProjects } from 'api/projects';
import { getHCPs, getHCPObjectives } from 'api/hcps';
import { postInteraction, getInteractionOutcomes } from 'api/interactions';
import {
  fetchInteractionActionTypes,
  recordInteractionActionTypes,
} from './constants';
import {
  fetchInteractionActions,
  recordInteractionActions,
} from './actions';

function* fetchRecordIntegrationSaga(action) {
  const { userId } = action;
  const query = { user: userId };

  try {
    const [
      hcpsResponse,
      hcpObjectivesResponse,
      resourcesResponse,
      projectsResponse,
      outcomesResponse,
    ] = yield [
      call(getHCPs, query),
      call(getHCPObjectives, query),
      call(getResources, query),
      call(getProjects, query),
      call(getInteractionOutcomes),
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
      outcomes: new List(outcomesResponse.data.map(
        (outcome) => new Map(outcome)
      )),
    };

    yield put(fetchInteractionActions.success(interaction));
  } catch (error) {
    yield put(fetchInteractionActions.error(error.message));
  }
}

function* recordInteractionSaga(action) {
  const { interaction } = action;
  try {
    yield call(postInteraction, interaction.toJS());
    yield put(recordInteractionActions.success());
  } catch (error) {
    yield put(recordInteractionActions.error(error.message));
  }
}

export default function* recordInteractionRootSaga() {
  yield takeLatest(fetchInteractionActionTypes.request, fetchRecordIntegrationSaga);
  yield takeLatest(recordInteractionActionTypes.request, recordInteractionSaga);
}
