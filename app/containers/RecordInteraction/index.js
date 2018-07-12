import React from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { reduxForm, formValueSelector, Field } from 'redux-form/immutable';
import {
  Grid,
  Col,
  Row,
  Button,
  Panel,
  FormControl,
} from 'react-bootstrap';
import Interaction from 'records/Interaction';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { LabeledFormControl, Options } from '../../components/forms';

import {
  searchHCPActions,
  fetchHCPObjectivesActions,
  recordInteractionActions,
} from './actions';


export class RecordInteraction extends React.PureComponent {
  static propTypes = {
    // match: PropTypes.object,
    handleSubmit: PropTypes.func,
    // searchHCPs: PropTypes.func,
    // fetchHCPObjectives: PropTypes.func,
    // userId: PropTypes.number,
    // hcps: PropTypes.array,
    hcpObjectives: PropTypes.array,
    projects: PropTypes.array,
    resources: PropTypes.array,
    originOfInteraction: PropTypes.string,
    isJointVisit: PropTypes.bool,
    isAdverseEvent: PropTypes.bool,
    // serverError: PropTypes.string,
  };

  // componentDidMount() {
  //   this.props.fetchInteractionRecordingRequiredData(this.props.userId);
  // }

  render() {
    const {
      // match,
      handleSubmit,
      // hcps,
      hcpObjectives,
      projects,
      resources,
      originOfInteraction,
      isJointVisit,
      isAdverseEvent,
      // serverError,
    } = this.props;

    return (
      <Grid>
        <Helmet>
          <title>OTSK - Record Interaction</title>
        </Helmet>

        <h2>Record Interaction</h2>

        <form onSubmit={handleSubmit}>

          <Row>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Search HCPs ..."
              />
            </Col>
            <Col sm={2}>
              <Button type="submit" block>Add HCP</Button>
            </Col>
          </Row>

          <br />

          <Row>
            <Col xs={12}>
              <Panel>
                <Panel.Heading>Interaction</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={6}>

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

                    </Col>
                    <Col xs={6}>
                      <Row>
                        <Col xs={6}>

                          <Field
                            name="is_proactive"
                            component={LabeledFormControl}
                            type="select"
                            label="Proactive or reactive?"
                          >
                            <option disabled value="">Select</option>
                            <Options
                              choices={[[true, 'Proactive'], [false, 'Reactive']]}
                            />
                          </Field>

                        </Col>
                        <Col xs={6}>

                          <Field
                            name="time_of_interaction"
                            component={LabeledFormControl}
                            type="text"
                            label="Time of interaction"
                          />

                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>

                          <Field
                            name="purpose"
                            component={LabeledFormControl}
                            type="text"
                            label="Purpose"
                          />

                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Panel>
                <Panel.Heading>Objective & Project</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={6}>

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

                    </Col>
                    <Col xs={6}>

                      <Field
                        name="project_id"
                        component={LabeledFormControl}
                        type="select"
                        label="Project"
                      >
                        <option disabled value="">Select a Project</option>
                        <Options
                          choices={projects.map((it) => [it.id, it.title])}
                        />
                      </Field>

                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Panel>
                <Panel.Heading>resources</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={6}>

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

                    </Col>
                    <Col xs={6}>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>

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

                    </Col>
                    <Col xs={6}>

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

                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Panel>
                <Panel.Heading>outcome & follow-up</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={3}>

                      <Field
                        name="follow_up_date"
                        component={LabeledFormControl}
                        type="text"
                        label="Follow-up date"
                      />

                    </Col>
                    <Col xs={6}>

                      <Field
                        name="follow_up_notes"
                        component={LabeledFormControl}
                        type="text"
                        label="Follow-up notes"
                      />

                    </Col>
                    <Col xs={3}>

                      <Field
                        name="is_follow_up_required"
                        component={LabeledFormControl}
                        type="checkbox"
                        label="No follow up required"
                      />

                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>

              <Button type="submit">Back</Button>
              {' '}
              <Button type="submit" bsStyle="primary" disabled>Save</Button>

            </Col>
          </Row>

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
    // userId: state.get('global').get('user').get('id'),
    // local
    serverError: recordInteractionState.get('serverError'),
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
    // fetchInteractionRecordingRequiredData: fetchInteractionRecordingRequiredDataActions.request,
    searchHCPs: searchHCPActions.request,
    recordInteraction: recordInteractionActions.request,
    fetchHCPObjectives: fetchHCPObjectivesActions.request,
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
      props.recordInteraction(new Interaction(data));
    },
  }),
)(RecordInteraction);
