import * as qs from 'qs';
import { OrderedMap } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { reduxForm, formValueSelector, Field } from 'redux-form/immutable';
import { Grid, Col, Row, Button, Panel } from 'react-bootstrap';

import Interaction from 'records/Interaction';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  FlatpickrDateTime,
  SearchSelect,
  LabeledFormControl,
  Options,
  CenteredAlert,
} from 'components/forms';
import HCPSelector from 'components/HCPSelector';
import SelectedHCP from 'components/SelectedHCP';
import { ButtonsSelector } from 'components/ButtonSelector';
import { ChoiceSelector } from 'components/ChoiceSelector';

import reducer from './reducer';
import saga from './saga';

import {
  searchHCPsActions,
  fetchHCPActions,
  fetchHCPObjectivesActions,
  recordInteractionActions,
  fetchInteractionRecordingRequiredDataActions,
} from './actions';

export class RecordInteraction extends React.Component {
  static propTypes = {
    therapeuticAreas: PropTypes.object,
    affiliateGroups: PropTypes.object,
    urlQuery: PropTypes.object,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    searchHCPs: PropTypes.func,
    fetchHCP: PropTypes.func,
    fetchHCPObjectives: PropTypes.func,
    fetchInteractionRecordingRequiredData: PropTypes.func,
    hcps: PropTypes.array,
    hcp: PropTypes.object,
    hcpObjectives: PropTypes.array,
    projects: PropTypes.array,
    resources: PropTypes.array,
    originOfInteraction: PropTypes.string,
    isJointVisit: PropTypes.bool,
    jointVisitReason: PropTypes.string,
    isAdverseEvent: PropTypes.bool,
    noFollowUpRequired: PropTypes.bool,
    allFormErrors: PropTypes.any,
    serverError: PropTypes.string,
    initialize: PropTypes.func.isRequired,
  };

  state = {
    recordWithoutConsent: false,
  };

  componentDidMount() {
    this.props.initialize({
      resources: [], // to quench warning
      origin_of_interaction: this.props.urlQuery.origin_of_interaction,
      hcp_id: this.props.urlQuery.hcp ? +this.props.urlQuery.hcp : undefined,
    });
    this.props.fetchHCP(null);
    this.props.fetchInteractionRecordingRequiredData();
    const hcpId = parseInt(this.props.urlQuery.hcp, 10);
    console.log('--- urlQuery:', this.props.urlQuery);
    if (hcpId) {
      console.log('--- preslected HCP:', hcpId);
      this.props.fetchHCP(hcpId);
      this.props.fetchHCPObjectives(hcpId);
    }
  }

  setRecordWithoutConsent = () => this.setState({ recordWithoutConsent: true });

  render() {
    const {
      therapeuticAreas,
      affiliateGroups,
      submitting,
      handleSubmit,
      searchHCPs,
      fetchHCP,
      fetchHCPObjectives,
      hcps,
      hcp,
      hcpObjectives,
      projects,
      resources,
      originOfInteraction,
      isJointVisit,
      jointVisitReason,
      isAdverseEvent,
      noFollowUpRequired,
      allFormErrors,
      serverError,
    } = this.props;

    if (!therapeuticAreas || !affiliateGroups) {
      return 'Loading...';
    }

    const formDisabled =
      hcp && !hcp.has_consented ? !this.state.recordWithoutConsent : false;

    // console.log('DISABLED=', formDisabled, (hcp && !hcp.has_consented), this.state.recordWithoutConsent);
    // console.log('SUBMIT DISABLED=', pristine, submitting, formDisabled, !!allFormErrors);

    return (
      <Grid>
        <Helmet>
          <title>OTSK - Record Interaction</title>
        </Helmet>

        <h2>Record Interaction</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        <form onSubmit={handleSubmit}>
          <Field
            name="hcp_id"
            component={HCPSelector}
            items={hcps}
            selectedItems={new OrderedMap(hcp ? [[hcp.id, hcp]] : [])}
            searchItems={searchHCPs}
            fetchItem={fetchHCP}
            removeItem={() => fetchHCP(null)}
            onItemSelected={fetchHCPObjectives}
            renderSelectedItem={SelectedHCP}
          />

          {hcp &&
            !hcp.has_consented &&
            !this.state.recordWithoutConsent && (
              <React.Fragment>
                <CenteredAlert bsStyle="danger" className="centered">
                  No interaction can be recorded for this HCP without their
                  consent.
                </CenteredAlert>
                <p className="text-center">
                  <a
                    role="button"
                    tabIndex={0}
                    onClick={this.setRecordWithoutConsent}
                  >
                    Click here to Record Interaction without HCP consent
                  </a>
                  <br />
                  <br />
                </p>
              </React.Fragment>
            )}

          <Row>
            <Col xs={12}>
              <Panel>
                <Panel.Heading>Interaction</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={6}>
                      <Field
                        name="type_of_interaction"
                        component={ButtonsSelector}
                        options={[
                          {
                            icon: 'icon-interaction-phone',
                            label: 'Phone',
                            value: 'phone',
                          },
                          {
                            icon: 'icon-interaction-face',
                            label: 'Face',
                            value: 'face_to_face',
                          },
                          {
                            icon: 'icon-interaction-email',
                            label: 'Email',
                            value: 'email',
                          },
                        ]}
                        disabled={formDisabled}
                      />
                    </Col>
                    <Col xs={6}>
                      <Row>
                        <Col xs={6}>
                          <Field
                            name="is_proactive"
                            component={ChoiceSelector}
                            choices={[[true, 'Proactive'], [false, 'Reactive']]}
                            disabled={formDisabled}
                          />
                        </Col>
                        <Col xs={6}>
                          <Field
                            name="time_of_interaction"
                            component={FlatpickrDateTime}
                            placeholder="Time of interaction"
                            className="form-control"
                            data-enable-time
                            disabled={formDisabled}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={6}>
                      <Field
                        name="origin_of_interaction"
                        component={LabeledFormControl}
                        type="select"
                        disabled={formDisabled}
                      >
                        <option disabled value="">
                          Select Origin of Interaction
                        </option>
                        <Options
                          choices={Object.entries(
                            Interaction.origin_of_interaction_choices
                          )}
                        />
                      </Field>

                      {originOfInteraction === 'other' && (
                        <Field
                          name="origin_of_interaction_other"
                          component={LabeledFormControl}
                          type="text"
                          placeholder="Other origin of interaction"
                          disabled={formDisabled}
                        />
                      )}

                      {originOfInteraction === 'engagement_plan' && (
                        <Field
                          name="hcp_objective_id"
                          placeholder="Select HCP Objective"
                          component={SearchSelect}
                          options={hcpObjectives.map((it) => ({
                            value: it.id,
                            label: it.description,
                          }))}
                          isDisabled={formDisabled}
                        />
                      )}
                    </Col>
                    <Col xs={6}>
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="purpose"
                            component={LabeledFormControl}
                            type="text"
                            placeholder="Enter purpose of interaction"
                            disabled={formDisabled}
                          />

                          <Field
                            name="project_id"
                            placeholder="Select Project"
                            component={SearchSelect}
                            options={projects.map((it) => ({
                              value: it.id,
                              label: it.title,
                            }))}
                            isDisabled={formDisabled}
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
                <Panel.Heading>Resources</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={12}>
                      <Field
                        name="resources"
                        placeholder="Resources Used"
                        component={SearchSelect}
                        options={resources.map((it) => ({
                          value: it.id,
                          label: it.title,
                        }))}
                        isMulti
                        isDisabled={formDisabled}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Field
                        name="is_adverse_event"
                        component={ChoiceSelector}
                        choices={[[false, 'No'], [true, 'Yes']]}
                        label="Adverse Event"
                        disabled={formDisabled}
                      >
                        {isAdverseEvent && (
                          <Field
                            name="appropriate_pv_procedures_followed"
                            component={ChoiceSelector}
                            choices={[[false, 'No'], [true, 'Yes']]}
                            label="Appropriate PV Procedures Followed"
                            disabled={formDisabled}
                          />
                        )}
                      </Field>
                    </Col>
                    <Col xs={6}>
                      <Field
                        name="is_joint_visit"
                        component={ChoiceSelector}
                        choices={[[false, 'No'], [true, 'Yes']]}
                        label="Joint Visit"
                        disabled={formDisabled}
                      >
                        {isJointVisit && (
                          <React.Fragment>
                            <Field
                              name="is_joint_visit_manager_approved"
                              component={ChoiceSelector}
                              choices={[[false, 'No'], [true, 'Yes']]}
                              label="MSL Manager Approval Received"
                              disabled={formDisabled}
                            />
                            <Row>
                              <Col md={6}>
                                <Field
                                  name="joint_visit_with"
                                  component={LabeledFormControl}
                                  type="text"
                                  placeholder="Joint visit with"
                                  disabled={formDisabled}
                                />
                              </Col>
                              <Col md={6}>
                                <Field
                                  name="joint_visit_reason"
                                  component={LabeledFormControl}
                                  type="select"
                                  disabled={formDisabled}
                                >
                                  <option disabled value="">
                                    Reason
                                  </option>
                                  <Options
                                    choices={Object.entries(
                                      Interaction.joint_visit_reason_choices
                                    )}
                                  />
                                </Field>
                              </Col>
                            </Row>
                            {jointVisitReason === 'other' && (
                              <Row>
                                <Col md={12}>
                                  <Field
                                    name="joint_visit_reason_other"
                                    component={LabeledFormControl}
                                    type="text"
                                    placeholder="Other reason for joint visit"
                                    disabled={formDisabled}
                                  />
                                </Col>
                              </Row>
                            )}
                          </React.Fragment>
                        )}
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
                <Panel.Heading>Outcome & Follow-up</Panel.Heading>
                <Panel.Body>
                  <Row>
                    <Col xs={3}>
                      <Field
                        name="follow_up_date"
                        component={FlatpickrDateTime}
                        className="form-control"
                        placeholder="Follow-up Date"
                        options={{ dateFormat: 'j M Y' }}
                        disabled={noFollowUpRequired || formDisabled}
                      />
                    </Col>
                    <Col xs={6}>
                      <Field
                        name="follow_up_notes"
                        component={LabeledFormControl}
                        type="text"
                        placeholder="Follow-up notes"
                        disabled={noFollowUpRequired || formDisabled}
                      />
                    </Col>
                    <Col xs={3}>
                      <Field
                        name="no_follow_up_required"
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

          {allFormErrors && (
            <CenteredAlert bsStyle="danger" className="centered">
              Please fill in all the fields above.
              {/* <pre>{JSON.stringify(allFormErrors, null, 2)}</pre> */}
            </CenteredAlert>
          )}

          <Row>
            <Col xs={12} className="text-center">
              <Button>Back</Button>{' '}
              <Button
                type="submit"
                disables=""
                bsStyle="primary"
                disabled={submitting || formDisabled}
              >
                Save
              </Button>
            </Col>
          </Row>
        </form>

        <br />
        <br />
      </Grid>
    );
  }
}

const validate = (values) => {
  // eslint-disable-line no-unused-vars
  const errors = {};

  if (!values.hcp_id) {
    errors.hcp_id = 'An HCP must be selected';
  }
  if (!values.type_of_interaction) {
    errors.type_of_interaction = 'The type of interaction must be specified';
  }
  if (!values.origin_of_interaction) {
    errors.origin_of_interaction =
      'The origin of interaction must be specified';
  }
  if (
    values.origin_of_interaction === 'other' &&
    !values.origin_of_interaction_other
  ) {
    errors.origin_of_interaction_other =
      'The other origin of interaction must be specified';
  }
  if (values.is_proactive === undefined) {
    errors.is_proactive =
      'Specify if this is a proactive or reactive interaction';
  }
  if (!values.time_of_interaction) {
    errors.time_of_interaction = 'Time of interaction must be entered';
  }
  if (!values.purpose) {
    errors.purpose = 'Purpose of interaction must be specified';
  }
  if (
    values.origin_of_interaction === 'engagement_plan' &&
    !values.hcp_objective_id
  ) {
    errors.hcp_objective_id =
      'HCP Objective must be specified for interactions when origin of interaction is Engagement Plan';
  }
  if (values.is_adverse_event === undefined) {
    errors.is_adverse_event =
      'It must be specified whether and adverse event has occurred';
  }
  if (
    values.is_adverse_event &&
    values.appropriate_pv_procedures_followed === undefined
  ) {
    errors.appropriate_pv_procedures_followed =
      'It must be specified whether appropriate PV procedures were followed';
  }
  if (values.is_joint_visit === undefined) {
    errors.is_joint_visit =
      'It must be specified whether this was a joint visit or not';
  }
  if (values.is_joint_visit && values.joint_visit_with === undefined) {
    errors.joint_visit_with =
      'It must be specified who was the joint visit with';
  }
  if (values.is_joint_visit && values.joint_visit_reason === undefined) {
    errors.joint_visit_reason =
      'It must be specified what was the reason of the joint visit';
  }
  if (!values.no_follow_up_required) {
    if (!values.follow_up_date) {
      errors.follow_up_date = 'A follow-up date must be specified';
    }
    if (!values.follow_up_notes) {
      errors.follow_up_notes = 'Follow-up notes must be entered';
    }
  }

  return errors;
};

const selector = formValueSelector('recordInteraction');

function mapStateToProps(state, ownProps) {
  const recordInteractionState = state.get('recordInteraction');
  return {
    // url query
    urlQuery: qs.parse(ownProps.location.search.slice(1)),
    // global
    therapeuticAreas: state.get('global').get('therapeuticAreas'),
    affiliateGroups: state.get('global').get('affiliateGroups'),
    allFormErrors:
      state.get('form') &&
      state.get('form').recordInteraction &&
      state.get('form').recordInteraction.anyTouched &&
      state.get('form').recordInteraction.syncErrors,
    // local
    serverError: recordInteractionState.get('serverError'),
    hcps: recordInteractionState.get('hcps').toJS(),
    hcp:
      recordInteractionState.get('hcp') &&
      recordInteractionState.get('hcp').toJS(),
    hcpObjectives: recordInteractionState.get('hcpObjectives').toJS(),
    projects: recordInteractionState.get('projects').toJS(),
    resources: recordInteractionState.get('resources').toJS(),
    // form selectors
    originOfInteraction: selector(state, 'origin_of_interaction'),
    isJointVisit: selector(state, 'is_joint_visit'),
    isAdverseEvent: selector(state, 'is_adverse_event'),
    noFollowUpRequired: selector(state, 'no_follow_up_required'),
    jointVisitReason: selector(state, 'joint_visit_reason'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      searchHCPs: searchHCPsActions.request,
      fetchHCP: fetchHCPActions.request,
      fetchInteractionRecordingRequiredData:
        fetchInteractionRecordingRequiredDataActions.request,
      recordInteraction: recordInteractionActions.request,
      fetchHCPObjectives: fetchHCPObjectivesActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'recordInteraction', reducer });
const withSaga = injectSaga({ key: 'recordInteraction', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  reduxForm({
    form: 'recordInteraction',
    validate,
    onSubmit: (data, dispatch, props) => {
      // data.outcome = 'follow_up';
      // data.description = '...';
      props.recordInteraction(new Interaction(data));
    },
    initialValues: {
      resources: [], // to quench warning
    },
    // enableReinitialize: true,
  })
)(RecordInteraction);
