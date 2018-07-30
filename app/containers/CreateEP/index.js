import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  Button,
  Col,
  Grid, Row,
  // Col,
  // Row,
  // Button,
  // Panel,
} from 'react-bootstrap';

import { CenteredAlert } from 'components/forms';
import injectSaga from 'utils/injectSaga';
import CreateEPAddHCPs from 'components/CreateEPAddHCPs';
import CreateEPAddHCPObjectives from 'components/CreateEPAddHCPObjectives';
import CreateEPAddProjects from 'components/CreateEPAddProjects';
import CreateEPAddProjectObjectives from 'components/CreateEPAddProjectObjectives';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  fetchCreateEPRequiredDataActions,
  // add HCPs
  searchHCPsActions,
  fetchHCPActions,
  removeHCPAction,
  selectHCPsAction,
  // add HCP Objectives
  updateHCPItemAction,
  addHCPObjectiveAction,
  updateHCPObjectiveAction,
  removeHCPObjectiveAction,
  addHCPObjectiveDeliverableAction,
  updateHCPObjectiveDeliverableAction,
  removeHCPObjectiveDeliverableAction,
  // Add Projects
  searchProjectsActions,
  fetchProjectActions,
  removeProjectAction,
  selectProjectsAction,
  // add Project Objectives
  updateProjectItemAction,
  addProjectObjectiveAction,
  updateProjectObjectiveAction,
  removeProjectObjectiveAction,
  addProjectObjectiveDeliverableAction,
  updateProjectObjectiveDeliverableAction,
  removeProjectObjectiveDeliverableAction,
  // create
  createEPActions,
} from './actions';


class CreateEP extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // common
    serverError: PropTypes.string,
    engagementPlan: PropTypes.object,
    bcsfs: PropTypes.object,
    medicalPlanObjectives: PropTypes.object,
    projects: PropTypes.object,
    fetchCreateEPRequiredData: PropTypes.func,
    // add HCPs
    hcps: PropTypes.object,
    selectedHCPs: PropTypes.object,
    searchHCPs: PropTypes.func,
    fetchHCP: PropTypes.func,
    selectHCPs: PropTypes.func,
    removeHCP: PropTypes.func,
    // add HCP Objectives
    updateHCPItem: PropTypes.func,
    addHCPObjective: PropTypes.func,
    updateHCPObjective: PropTypes.func,
    removeHCPObjective: PropTypes.func,
    addHCPObjectiveDeliverable: PropTypes.func,
    updateHCPObjectiveDeliverable: PropTypes.func,
    removeHCPObjectiveDeliverable: PropTypes.func,
    // add Projects
    searchedProjects: PropTypes.object,
    selectedProjects: PropTypes.object,
    searchProjects: PropTypes.func,
    fetchProject: PropTypes.func,
    selectProjects: PropTypes.func,
    removeProject: PropTypes.func,
    // add Project Objectives
    // updateProjectItem: PropTypes.func,
    addProjectObjective: PropTypes.func,
    updateProjectObjective: PropTypes.func,
    removeProjectObjective: PropTypes.func,
    addProjectObjectiveDeliverable: PropTypes.func,
    updateProjectObjectiveDeliverable: PropTypes.func,
    removeProjectObjectiveDeliverable: PropTypes.func,
    // create EP
    createEP: PropTypes.func,
  };

  componentDidMount() {
    this.props.fetchCreateEPRequiredData();
  }

  render() {
    const {
      serverError,
      engagementPlan,
      // add HCPs
      hcps,
      selectedHCPs,
      searchHCPs,
      fetchHCP,
      selectHCPs,
      removeHCP,
      // add HCP Objectives
      bcsfs,
      medicalPlanObjectives,
      projects,
      updateHCPItem,
      addHCPObjective,
      updateHCPObjective,
      removeHCPObjective,
      addHCPObjectiveDeliverable,
      updateHCPObjectiveDeliverable,
      removeHCPObjectiveDeliverable,
      // add Projects
      searchedProjects,
      selectedProjects,
      searchProjects,
      fetchProject,
      selectProjects,
      removeProject,
      // add Project Objectives
      // updateProjectItem,
      addProjectObjective,
      updateProjectObjective,
      removeProjectObjective,
      addProjectObjectiveDeliverable,
      updateProjectObjectiveDeliverable,
      removeProjectObjectiveDeliverable,
      // create EP
      createEP,
    } = this.props;

    return (
      <Grid>
        <h2>Create Engagement Plan</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        <hr />
        <CreateEPAddHCPs
          hcps={hcps}
          selectedHCPs={selectedHCPs}
          hcpItems={engagementPlan.hcp_items}
          fetchHCP={fetchHCP}
          searchHCPs={searchHCPs}
          selectHCPs={selectHCPs}
          removeHCP={removeHCP}
          updateHCPItem={updateHCPItem} // (hcpId, data)
        />

        <hr />
        <CreateEPAddHCPObjectives
          selectedHCPs={selectedHCPs}
          hcpItems={engagementPlan.hcp_items}
          addHCPObjective={addHCPObjective} // (hcpId)
          updateHCPObjective={updateHCPObjective} // (hcpId, idx, data)
          removeHCPObjective={removeHCPObjective} // (hcpId, idx)
          addDeliverable={addHCPObjectiveDeliverable} // (hcpId, objectiveIdx)
          updateDeliverable={updateHCPObjectiveDeliverable} // (hcpId, objectiveIdx, deliverableIdx, data)
          removeDeliverable={removeHCPObjectiveDeliverable} // (hcpId, objectiveIdx, deliverableIdx)
          bcsfs={bcsfs}
          medicalPlanObjectives={medicalPlanObjectives}
          projects={projects}
        />

        <hr />
        <CreateEPAddProjects
          projects={searchedProjects}
          selectedProjects={selectedProjects}
          projectItems={engagementPlan.project_items}
          fetchProject={fetchProject}
          searchProjects={searchProjects}
          selectProjects={selectProjects}
          removeProject={removeProject}
        />

        <hr />
        <CreateEPAddProjectObjectives
          selectedProjects={selectedProjects}
          projectItems={engagementPlan.project_items}
          addProjectObjective={addProjectObjective} // (projectId)
          updateProjectObjective={updateProjectObjective} // (projectId, idx, data)
          removeProjectObjective={removeProjectObjective} // (projectId, idx)
          addDeliverable={addProjectObjectiveDeliverable} // (projectId, objectiveIdx)
          updateDeliverable={updateProjectObjectiveDeliverable} // (projectId, objectiveIdx, deliverableIdx, data)
          removeDeliverable={removeProjectObjectiveDeliverable} // (projectId, objectiveIdx, deliverableIdx)
        />

        <br />
        <Row>
          <Col xs={12} className="text-center">
            <Button
              onClick={() => createEP(engagementPlan)}
              bsStyle="primary"
            >
              Create Engagement Plan
            </Button>
          </Col>
        </Row>

      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const createEPState = state.get('createEP');
  return {
    serverError: createEPState.get('serverError'),
    engagementPlan: createEPState.get('engagementPlan'),
    // add HCPs
    hcps: createEPState.get('hcps'),
    selectedHCPs: createEPState.get('selectedHCPs'),
    // add HCP Objectives
    bcsfs: createEPState.get('bcsfs'),
    medicalPlanObjectives: createEPState.get('medicalPlanObjectives'),
    projects: createEPState.get('projects'),
    // add Projects
    searchedProjects: createEPState.get('searchedProjects'),
    selectedProjects: createEPState.get('selectedProjects'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCreateEPRequiredData: fetchCreateEPRequiredDataActions.request,
    // add HCPs
    searchHCPs: searchHCPsActions.request,
    fetchHCP: fetchHCPActions.request,
    selectHCPs: selectHCPsAction,
    removeHCP: removeHCPAction,
    // add HCP Objectives
    updateHCPItem: updateHCPItemAction,
    addHCPObjective: addHCPObjectiveAction,
    updateHCPObjective: updateHCPObjectiveAction,
    removeHCPObjective: removeHCPObjectiveAction,
    addHCPObjectiveDeliverable: addHCPObjectiveDeliverableAction,
    updateHCPObjectiveDeliverable: updateHCPObjectiveDeliverableAction,
    removeHCPObjectiveDeliverable: removeHCPObjectiveDeliverableAction,
    // Add Projects
    searchProjects: searchProjectsActions.request,
    fetchProject: fetchProjectActions.request,
    selectProjects: selectProjectsAction,
    removeProject: removeProjectAction,
    // add Projects Objectives
    updateProjectItem: updateProjectItemAction,
    addProjectObjective: addProjectObjectiveAction,
    updateProjectObjective: updateProjectObjectiveAction,
    removeProjectObjective: removeProjectObjectiveAction,
    addProjectObjectiveDeliverable: addProjectObjectiveDeliverableAction,
    updateProjectObjectiveDeliverable: updateProjectObjectiveDeliverableAction,
    removeProjectObjectiveDeliverable: removeProjectObjectiveDeliverableAction,
    // create EP
    createEP: createEPActions.request,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'createEP', reducer });
const withSaga = injectSaga({ key: 'createEP', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CreateEP);
