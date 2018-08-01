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
import CreateEPAddProjects from 'components/CreateEPAddProjects';
import CreateEPAddProjectObjectives from 'components/CreateEPAddProjectObjectives';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

class EPForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // outside provided
    mode: PropTypes.string, // 'create' | 'edit'
    onSubmit: PropTypes.func,
    initEngagementPlan: PropTypes.object,
    // common
    serverError: PropTypes.string,
    engagementPlan: PropTypes.object,
    setEP: PropTypes.func,
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
  };

  constructor(props) {
    console.log('% EPForm.constructor');
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  componentDidMount() {
    console.log('% EPForm.componentDidMount');
    if (this.props.initEngagementPlan) {
      console.log('=== initializing EP');
      this.props.setEP(this.props.initEngagementPlan);
    }
    this.props.fetchCreateEPRequiredData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.initEngagementPlan !== prevProps.initEngagementPlan) {
      console.log('=== initializing EP (2)');
      this.props.setEP(this.props.initEngagementPlan);
    }
  }

  render() {
    console.log('% EPForm.render');

    const steps = {
      0: <CreateEPAddHCPs {...this.props} />,
      1: <CreateEPAddProjects {...this.props} />,
      2: (
        <div>
          <CreateEPAddProjectObjectives {...this.props} />
          <br />
          <Row>
            <Col xs={12} className="text-center">
              <Button
                onClick={() => this.props.onSubmit(this.props.engagementPlan)}
                bsStyle="primary"
              >
                Create Engagement Plan
              </Button>
            </Col>
          </Row>
        </div>
      ),
    };
    const renderedStep = steps[this.state.activeStep];

    return (
      <Grid>
        {this.props.serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{this.props.serverError}</pre>
          </CenteredAlert>
        )}

        <Row className="text-center">
          <ButtonGroup>
            <Button
              active={this.state.activeStep === 0}
              onClick={() => this.setState({ activeStep: 0 })}
            >
              1. HCPs & Objectives
            </Button>
            <Button
              active={this.state.activeStep === 1}
              onClick={() => this.setState({ activeStep: 1 })}
            >
              2. Add Projects
            </Button>
            <Button
              active={this.state.activeStep === 2}
              onClick={() => this.setState({ activeStep: 2 })}
            >
              3. Project Objectives
            </Button>
          </ButtonGroup>
        </Row>

        <hr />
        {renderedStep}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const createEPState = state.get('epForm');
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
      fetchCreateEPRequiredData:
        actions.fetchCreateEPRequiredDataActions.request,
      // add HCPs
      searchHCPs: actions.searchHCPsActions.request,
      fetchHCP: actions.fetchHCPActions.request,
      selectHCPs: actions.selectHCPsAction,
      removeHCP: actions.removeHCPAction,
      // add HCP Objectives
      updateHCPItem: actions.updateHCPItemAction,
      addHCPObjective: actions.addHCPObjectiveAction,
      updateHCPObjective: actions.updateHCPObjectiveAction,
      removeHCPObjective: actions.removeHCPObjectiveAction,
      addHCPObjectiveDeliverable: actions.addHCPObjectiveDeliverableAction,
      updateHCPObjectiveDeliverable:
        actions.updateHCPObjectiveDeliverableAction,
      removeHCPObjectiveDeliverable:
        actions.removeHCPObjectiveDeliverableAction,
      // add Projects
      searchProjects: actions.searchProjectsActions.request,
      fetchProject: actions.fetchProjectActions.request,
      selectProjects: actions.selectProjectsAction,
      removeProject: actions.removeProjectAction,
      // add Projects Objectives
      updateProjectItem: actions.updateProjectItemAction,
      addProjectObjective: actions.addProjectObjectiveAction,
      updateProjectObjective: actions.updateProjectObjectiveAction,
      removeProjectObjective: actions.removeProjectObjectiveAction,
      addProjectObjectiveDeliverable:
        actions.addProjectObjectiveDeliverableAction,
      updateProjectObjectiveDeliverable:
        actions.updateProjectObjectiveDeliverableAction,
      removeProjectObjectiveDeliverable:
        actions.removeProjectObjectiveDeliverableAction,
      setEP: actions.setEPAction,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'epForm', reducer });
const withSaga = injectSaga({ key: 'epForm', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(EPForm);
