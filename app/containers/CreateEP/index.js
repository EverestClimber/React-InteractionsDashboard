import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  Button,
  ButtonGroup,
  Col,
  Grid,
  Row,
  // Col,
  // Row,
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

class CreateEP extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
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

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  componentDidMount() {
    this.props.fetchCreateEPRequiredData();
  }

  renderStep(step) {
    if (step === 0) {
      return <CreateEPAddHCPs {...this.props} />;
    } else if (step === 1) {
      return <CreateEPAddHCPObjectives {...this.props} />;
    } else if (step === 2) {
      return <CreateEPAddProjects {...this.props} />;
    } else if (step === 3) {
      return (
        <div>
          <CreateEPAddProjectObjectives {...this.props} />
          <br />
          <Row>
            <Col xs={12} className="text-center">
              <Button
                onClick={() => this.props.createEP(this.props.engagementPlan)}
                bsStyle="primary"
              >
                Create Engagement Plan
              </Button>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <Grid>
        <h2>Create Engagement Plan</h2>

        <Row className="text-center">
          <ButtonGroup>
            <Button
              active={this.state.activeStep === 0}
              onClick={() => this.setState({ activeStep: 0 })}
            >
              1. Add HCPs
            </Button>
            <Button
              active={this.state.activeStep === 1}
              onClick={() => this.setState({ activeStep: 1 })}
            >
              2. HCP Objective
            </Button>
            <Button
              active={this.state.activeStep === 2}
              onClick={() => this.setState({ activeStep: 2 })}
            >
              3. Add Projects
            </Button>
            <Button
              active={this.state.activeStep === 3}
              onClick={() => this.setState({ activeStep: 3 })}
            >
              4. Project Objectives
            </Button>
          </ButtonGroup>
        </Row>

        {this.props.serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{this.props.serverError}</pre>
          </CenteredAlert>
        )}

        <hr />
        {this.renderStep(this.state.activeStep)}
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
  return bindActionCreators(
    {
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
      // add Projects
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
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'createEP', reducer });
const withSaga = injectSaga({ key: 'createEP', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(CreateEP);
