/* eslint-disable */
import { List } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/es/effects';
import { setLoading } from 'containers/App/actions';
import {
  fetchCreateEPRequiredDataActions,
  fetchHCPActions,
  searchHCPsActions
} from './actions';
import { makeFetchHCPSaga, makeSearchHCPsSaga } from 'containers/App/saga';
import { BCSF } from 'records/BCSF';
import { MedicalPlanObjective } from 'records/MedicalPlanObjective';
import { Project } from 'records/Project';
import { getBCSFs } from 'api/bcsfs';
import { getMedicalPlanObjectives } from "api/medicalPlanObjectives";
import { getProjects } from 'api/projects';


function* fetchCreateEPRequiredDataSaga() {
  yield put(setLoading(true));

  console.log('### fetchCreateEPRequiredDataSaga');

  try {
    const [
      bcfsResponse,
      medicalPlanObjectivesResponse,
      projectsResponse,
    ] = yield [
      call(getBCSFs),
      call(getMedicalPlanObjectives),
      call(getProjects),
    ];

    const payload = {
      bcsfs: new List(bcfsResponse.data.map(
        (data) => BCSF.fromApiData(data)
      )),
      medicalPlanObjectives: new List(medicalPlanObjectivesResponse.data.map(
        (data) => MedicalPlanObjective.fromApiData(data)
      )),
      projects: new List(projectsResponse.data.map(
        (data) => Project.fromApiData(data)
      )),
    };

    yield put(fetchCreateEPRequiredDataActions.success(payload));

  } catch (error) {
    yield put(fetchCreateEPRequiredDataActions.error(error.message));
  }
  yield put(setLoading(false));
}

// Individual exports for testing
export default function* createEPRootSage() {
  yield takeLatest(
    fetchCreateEPRequiredDataActions.request.type,
    fetchCreateEPRequiredDataSaga
  );

  yield takeLatest(
    searchHCPsActions.request.type,
    makeSearchHCPsSaga(searchHCPsActions.success, searchHCPsActions.error)
  );

  yield takeLatest(
    fetchHCPActions.request.type,
    makeFetchHCPSaga(fetchHCPActions.success, fetchHCPActions.error)
  );
}
