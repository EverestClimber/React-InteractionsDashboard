import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import {
  Grid, Button,
} from 'react-bootstrap';
import Interaction from 'records/interaction';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { LabeledField } from '../../components/forms';

import {
  fetchInteractionActions,
  recordInteractionActions,
} from './actions';


export class RecordInteraction extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func,
    fetchRecordInteraction: PropTypes.func,
    userId: PropTypes.number,
    hcps: PropTypes.instanceOf(List),
    hcpObjectives: PropTypes.instanceOf(List),
    projects: PropTypes.instanceOf(List),
    resources: PropTypes.instanceOf(List),
    originOfInteraction: PropTypes.string,
    isJointVisit: PropTypes.string,
    isAdverseEvent: PropTypes.string,
  };

  componentDidMount() {
    this.props.fetchRecordInteraction(this.props.userId);
  }

  render() {
    const {
      handleSubmit,
      hcps,
      hcpObjectives,
      projects,
      resources,
      originOfInteraction,
      isJointVisit,
      isAdverseEvent,
    } = this.props;

    return (
      <Grid>
        <Helmet>
          <title>OTSK - Record Interaction</title>
        </Helmet>

        <h2>Record Interaction</h2>

        <form onSubmit={handleSubmit}>

          <LabeledField
            name="hcp_id"
            type="select"
            label="HCP"
            options={hcps.map((hcp) => [
              hcp.id,
              `${hcp.first_name} ${hcp.last_name}`,
            ])}
            // validationState="error"
            helpText="Please select the HCP you interacted with"
          />

          <LabeledField
            name="resources"
            type="select"
            label="Resources"
            options={resources.map((it) => [it.id, it.title])}
            multiple
          />

          <LabeledField
            name="hcp_objective_id"
            type="select"
            label="HCP Objective"
            options={hcpObjectives.map((it) => [
              it.id,
              it.description])}
          />

          <LabeledField
            name="type_of_interaction"
            type="select"
            label="Type of Interaction"
            options={Object.entries(Interaction.type_of_interaction_choices)}
          />

          <LabeledField
            name="project_id"
            type="select"
            label="Projects"
            options={projects.map((it) => [it.id, it.title])}
          />

          <LabeledField
            name="origin_of_interaction"
            type="select"
            label="Origin of Interaction"
            options={Object.entries(Interaction.origin_of_interaction_choices)}
          />

          {originOfInteraction === 'other' && (
            <LabeledField
              name="origin_of_interaction_other"
              type="text"
              placeholder="Other origin of interaction"
            />)}

          <LabeledField
            name="purpose"
            type="text"
            label="Purpose"
          />

          <LabeledField
            name="is_joint_visit"
            type="checkbox"
            label="Joint Visit"
          />

          {isJointVisit && (
            <LabeledField
              name="joint_visit_with"
              type="text"
              label="Joint visit with"
            />)}

          <LabeledField
            name="is_adverse_event"
            type="checkbox"
            label="Adverse Event"
          />

          {isAdverseEvent && (
            <LabeledField
              name="appropriate_pv_procedures_followed"
              type="checkbox"
              label="Appropriate PV Procedures Followed"
            />)}

          <LabeledField
            name="is_follow_up_required"
            type="checkbox"
            label="Follow up required"
          />

          <LabeledField
            name="description"
            type="textarea"
            label="Description"
          />

          <Button type="submit" bsStyle="primary">Save</Button>
        </form>

        <br /><br />
      </Grid>
    );
  }
}

const selector = formValueSelector('recordInteraction');

function mapStateToProps(state) {
  const recordInteractionState = state.get('recordInteraction');
  return {
    userId: state.get('global').get('user').get('id'),
    hcps: recordInteractionState.get('hcps').toJS(),
    hcpObjectives: recordInteractionState.get('hcpObjectives').toJS(),
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
    },
    onSubmit: (data, dispatch, props) => {
      props.recordInteraction(new Interaction(data));
    },
  }),
)(RecordInteraction);
