import { takeLatest, call, put } from 'redux-saga/effects';
import { List, Map } from 'immutable';

import HCP from 'records/hcp';
import Project from 'records/project';
import Objective from 'records/objective';
import { getResources } from 'api/resources';
import { getProjects } from 'api/projects';
import { getHCP, getHCPs, getHCPObjectives } from 'api/hcps';
import { postInteraction } from 'api/interactions';
import {
  fetchInteractionActionTypes,
  recordInteractionActionTypes,
} from './constants';
import {
  fetchInteractionActions,
  recordInteractionActions,
  getHCPObjectivesForHCPActions,
} from './actions';
import { setLoading } from '../App/actions';


function* fetchRecordIntegrationSaga(action) {  // eslint-disable-line
  const {
    // userId,
    engagementPlanId,
    hcpId,
  } = action;
  // const query = { user: userId };

  yield put(setLoading(true));

  try {
    let hcps;
    if (hcpId) {
      const hcpResponse = yield call(getHCP, hcpId);
      hcps = new List([HCP.fromApiObject(hcpResponse.data)]);

    } else if (engagementPlanId) {
      const hcpsResponse = yield call(getHCPs, { engagement_plan: engagementPlanId });
      hcps = new List(hcpsResponse.data.map(
        (hcp) => HCP.fromApiObject(hcp)
      ));

    } else {
      const hcpsResponse = yield call(getHCPs, { engagement_plan: engagementPlanId });
      hcps = new List(hcpsResponse.data.map(
        (hcp) => HCP.fromApiObject(hcp)
      ));
    }

    const [
      resourcesResponse,
      projectsResponse,
    ] = yield [
      call(getResources),
      call(getProjects),
    ];

    const payload = {
      hcps,
      resources: new List(resourcesResponse.data.map(
        (resource) => new Map(resource)
      )),
      projects: new List(projectsResponse.data.map(
        (project) => Project.fromApiObject(project)
      )),
    };

    yield put(setLoading(false));
    yield put(fetchInteractionActions.success(payload));

  } catch (error) {
    yield put(fetchInteractionActions.error(error.message));
    yield put(setLoading(false));
  }
}


function* getHCPObjectivesForHCPSaga(action) {
  const { hcpId } = action;
  try {
    const res = yield call(getHCPObjectives, { hcp: hcpId });
    const hcpObjectives = new List(res.data.map(
      (objective) => Objective.fromApiObject(objective)
    ));

    yield put(getHCPObjectivesForHCPActions.success(hcpObjectives));

  } catch (error) {
    yield put(getHCPObjectivesForHCPActions.error(error.message));
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
  yield takeLatest(getHCPObjectivesForHCPActions.request.type, getHCPObjectivesForHCPSaga);
  yield takeLatest(recordInteractionActionTypes.request, recordInteractionSaga);
}
