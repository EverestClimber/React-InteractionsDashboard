import React from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { reduxForm, formValueSelector, Field } from 'redux-form/immutable';
import {
  Grid, Button, Alert,
} from 'react-bootstrap';
import Interaction from 'records/Interaction';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { LabeledFormControl, Options } from '../../components/forms';

import {
  fetchInteractionActions,
  recordInteractionActions,
} from './actions';


export class RecordInteraction extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object,
    handleSubmit: PropTypes.func,
    fetchRecordInteraction: PropTypes.func,
    userId: PropTypes.number,
    hcps: PropTypes.array,
    hcpObjectives: PropTypes.array,
    projects: PropTypes.array,
    resources: PropTypes.array,
    originOfInteraction: PropTypes.string,
    isJointVisit: PropTypes.bool,
    isAdverseEvent: PropTypes.bool,
    serverError: PropTypes.string,
  };

  componentDidMount() {
    this.props.fetchRecordInteraction(this.props.userId);
  }

  render() {
    const {
      match,
      handleSubmit,
      hcps,
      hcpObjectives,
      projects,
      resources,
      originOfInteraction,
      isJointVisit,
      isAdverseEvent,
      serverError,
    } = this.props;

    return (
      <Grid>
        <Helmet>
          <title>OTSK - Record Interaction</title>
        </Helmet>

        <h2>Record Interaction</h2>

        <p>For Engagement Plan #{match.params.engagementPlanId}</p>
        <p>For HCP #{match.params.hcpId}</p>

        {serverError && (
          <Alert bsStyle="danger">
            <h4>An error has occured</h4>
            <p>Please try again in a few minutes and/or refresh the page before retrying.</p>
            <p>
              <small><strong>Details:</strong> {serverError}</small>
            </p>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <Field
            name="hcp_id"
            component={LabeledFormControl}
            type="select"
            label="HCP"
          >
            <option disabled value="">Select a HCP</option>
            <Options
              choices={hcps.map((hcp) => [
                hcp.id,
                `${hcp.first_name} ${hcp.last_name}`,
              ])}
            />
          </Field>

          <Field
            name="hcp_objective_id"
            component={LabeledFormControl}
            type="select"
            label="HCP Objective"
          >
            <option disabled value="">Select a HCP Objective</option>
            <Options
              choices={hcpObjectives.map((it) => [
                it.id,
                it.description])}
            />
          </Field>

          <Field
            name="project_id"
            component={LabeledFormControl}
            type="select"
            label="Projects"
          >
            <option disabled value="">Select a Project</option>
            <Options
              choices={projects.map((it) => [it.id, it.title])}
            />
          </Field>

          <Field
            name="resources"
            component={LabeledFormControl}
            type="select"
            label="Projects"
            multiple
          >
            <Options
              choices={resources.map((it) => [it.id, it.title])}
            />
          </Field>

          {/* TODO: use appropriate UI control for this */}
          <Field
            name="time_of_interaction"
            component={LabeledFormControl}
            type="text"
            label="Time of interaction"
          />

          <Field
            name="description"
            component={LabeledFormControl}
            type="textarea"
            label="Description"
          />

          <Field
            name="purpose"
            component={LabeledFormControl}
            type="text"
            label="Purpose"
          />

          <Field
            name="is_joint_visit"
            component={LabeledFormControl}
            type="checkbox"
            label="Joint Visit"
          />

          {isJointVisit && (
            <React.Fragment>
              <Field
                name="joint_visit_with"
                component={LabeledFormControl}
                type="text"
                label="Joint visit with"
              />
              <Field
                name="joint_visit_reason"
                component={LabeledFormControl}
                type="text"
                label="Joint visit reason"
              />
            </React.Fragment>
          )}

          <Field
            name="origin_of_interaction"
            component={LabeledFormControl}
            type="select"
            label="Origin of Interaction"
          >
            <option disabled value="">Pick an option</option>
            <Options
              choices={Object.entries(Interaction.origin_of_interaction_choices)}
            />
          </Field>

          {originOfInteraction === 'other' && (
            <Field
              name="origin_of_interaction_other"
              component={LabeledFormControl}
              type="text"
              label="Other origin of interaction"
            />
          )}

          <Field
            name="type_of_interaction"
            component={LabeledFormControl}
            type="select"
            label="Type of Interaction"
          >
            <option disabled value="">Pick an option</option>
            <Options
              choices={Object.entries(Interaction.type_of_interaction_choices)}
            />
          </Field>

          <Field
            name="is_proactive"
            component={LabeledFormControl}
            type="select"
            label="Proactive?"
          >
            <option disabled value="">Select Yes or No</option>
            <Options
              choices={[[true, 'Yes'], [false, 'No']]}
            />
          </Field>

          <Field
            name="is_adverse_event"
            component={LabeledFormControl}
            type="checkbox"
            label="Adverse Event"
          />

          {isAdverseEvent && (
            <Field
              name="appropriate_pv_procedures_followed"
              component={LabeledFormControl}
              type="checkbox"
              label="Appropriate PV Procedures Followed"
            />
          )}

          <Field
            name="outcome"
            component={LabeledFormControl}
            type="select"
            label="Outcome"
          >
            <option disabled value="">Pick an option</option>
            <Options
              choices={Object.entries(Interaction.outcome_choices)}
            />
          </Field>

          <Field
            name="is_follow_up_required"
            component={LabeledFormControl}
            type="checkbox"
            label="Follow up required"
          />

          <Button type="submit" bsStyle="primary">Save</Button>
        </form>

        <br /><br />
      </Grid>
    );
  }
}

const validate = (values) => {
  // debugger;
  console.log('... VALIDATING:', values);
  const errors = {};
  if (!values.hcp_id) {
    errors.hcp_id = 'An HCP must be selected';
  }
  // if (!values.purpose) {
  //   errors.purpose = 'Please specify a purpose';
  // }
  errors.purpose = 'WRONG';
  return errors;
};

const selector = formValueSelector('recordInteraction');

function mapStateToProps(state) {
  const recordInteractionState = state.get('recordInteraction');
  return {
    // global
    userId: state.get('global').get('user').get('id'),
    // local
    serverError: recordInteractionState.get('serverError'),
    hcps: recordInteractionState.get('hcps').toJS(),
    hcpObjectives: [],
    // hcpObjectives: recordInteractionState.get('hcpObjectives').toJS(),
    projects: recordInteractionState.get('projects').toJS(),
    resources: recordInteractionState.get('resources').toJS(),
    originOfInteraction: selector(state, 'origin_of_interaction'),
    isJointVisit: selector(state, 'is_joint_visit'),
    isAdverseEvent: selector(state, 'is_adverse_event'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchRecordInteraction: fetchInteractionActions.request,
    recordInteraction: recordInteractionActions.request,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'recordInteraction', reducer });
const withSaga = injectSaga({ key: 'recordInteraction', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  reduxForm({
    form: 'recordInteraction',
    initialValues: {
      resources: [],  // to quench warning
      time_of_interaction: new Date().toISOString(),
    },
    validate,
    onSubmit: (data, dispatch, props) => {
      // debugger;
      props.recordInteraction(new Interaction(data));
    },
  }),
)(RecordInteraction);
