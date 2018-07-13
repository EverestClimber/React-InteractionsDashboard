import * as qs from 'qs';
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
  Table,
} from 'react-bootstrap';
import Interaction from 'records/Interaction';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { LabeledFormControl, Options } from 'components/forms';
import { ButtonsSelector } from 'components/ButtonSelector';
import { ChoiceSelector } from 'components/ChoiceSelector';
import reducer from './reducer';
import saga from './saga';

import {
  searchHCPsActions,
  fetchHCPActions,
  fetchHCPObjectivesActions,
  recordInteractionActions, fetchInteractionRecordingRequiredDataActions,
} from './actions';


class HCPSelector extends React.Component {
  static propTypes = {
    // supplied by Field
    input: PropTypes.object, // { onChange, value, ...}
    // meta: PropTypes.object, // { error, ... }
    // other
    hcps: PropTypes.array,
    hcp: PropTypes.object,
    searchHCPs: PropTypes.func,
    fetchHCP: PropTypes.func,
    onHCPSelected: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchHCPsText: '',
    };
  }

  componentDidMount() {
    console.log('=== props', this.props);
    const hcpId = this.props.input.value;
    if (hcpId) {
      this.props.fetchHCP(hcpId);
    }
  }

  handleSearchHCPsInputChange = (event) => {
    this.setState({ searchHCPsText: event.target.value });
  };

  searchHCPsKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('...will search for HCPs');
      this.props.searchHCPs(this.state.searchHCPsText);
    }
  };

  handleHCPSelection = (event) => {
    // console.log('=== props:', this.props);
    const hcpId = event.target.value;
    this.props.input.onChange(hcpId);
    this.props.fetchHCP(hcpId);
    this.props.onHCPSelected(hcpId);
  };

  render() {
    const { hcps, hcp } = this.props;

    return (
      <div className="HCPSelector">
        <Row>
          <Col sm={10}>
            <FormControl
              type="text"
              placeholder="Search HCPs ..."
              onChange={this.handleSearchHCPsInputChange}
              onKeyPress={this.searchHCPsKeyPressed}
              className="form-control--primary"
            />
          </Col>
          <Col sm={2}>
            <Button type="submit" block>
              <span className="fi-icon icon-nav-hcps" />
              {' '}New HCP
            </Button>
          </Col>
        </Row>
        <br />

        <Row>
          <Col xs={12}>
            <Table bordered condensed hover>
              <tbody>
                {hcps.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <input type="radio" name="hcp" value={it.id} onChange={this.handleHCPSelection} />
                    </td>
                    <td>{it.first_name} {it.last_name}</td>
                    <td>{it.institution_name}</td>
                    <td>{it.city}, {it.country}</td>
                    <td>{it.ta_names.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <br />

        {hcp && (
          <Row>
            <Col xs={12}>
              <Table bordered condensed hover>
                <tbody>
                  <tr key={hcp.id}>
                    <td>{hcp.id}</td>
                    <td>{hcp.first_name} {hcp.last_name}</td>
                    <td>{hcp.institution_name}</td>
                    <td>{hcp.city}, {hcp.country}</td>
                    <td>{hcp.ta_names.join(', ')}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}


export class RecordInteraction extends React.Component { // eslint-disable-line react/no-multi-comp
  static propTypes = {
    // location: PropTypes.object,
    urlQuery: PropTypes.object,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func,
    searchHCPs: PropTypes.func,
    fetchHCP: PropTypes.func,
    fetchHCPObjectives: PropTypes.func,
    fetchInteractionRecordingRequiredData: PropTypes.func,
    // userId: PropTypes.number,
    hcps: PropTypes.array,
    hcp: PropTypes.object,
    hcpObjectives: PropTypes.array,
    projects: PropTypes.array,
    resources: PropTypes.array,
    originOfInteraction: PropTypes.string,
    isJointVisit: PropTypes.bool,
    isAdverseEvent: PropTypes.bool,
    // serverError: PropTypes.string,
  };

  componentDidMount() {
    this.props.fetchInteractionRecordingRequiredData();
    const hcpId = parseInt(this.props.urlQuery.hcp, 10);
    if (hcpId) {
      this.props.fetchHCP(hcpId);
      this.props.fetchHCPObjectives(hcpId);
    }
  }

  render() {
    const {
      submitting,
      pristine,
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

          <Field
            name="hcp_id"
            component={HCPSelector}
            hcps={hcps}
            hcp={hcp}
            searchHCPs={searchHCPs}
            fetchHCP={fetchHCP}
            onHCPSelected={fetchHCPObjectives}
          />

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
                      />

                      <Field
                        name="origin_of_interaction"
                        component={LabeledFormControl}
                        type="select"
                      >
                        <option disabled value="">Select Origin of Interaction</option>
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
                            component={ChoiceSelector}
                            choices={[[true, 'Proactive'], [false, 'Reactive']]}
                          />

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

              <Button>Back</Button>
              {' '}
              <Button
                type="submit"
                disables=""
                bsStyle="primary"
                disabled={pristine || submitting}
              >
                Save
              </Button>

            </Col>
          </Row>

        </form>

        <br /><br />
      </Grid>
    );
  }
}

const validate = (values) => { // eslint-disable-line no-unused-vars
                               // debugger;
                               // console.log('... VALIDATING:', values);
  const errors = {};
  // if (!values.hcp_id) {
  //   errors.hcp_id = 'An HCP must be selected';
  // }
  // // if (!values.purpose) {
  // //   errors.purpose = 'Please specify a purpose';
  // // }
  // errors.purpose = 'WRONG';
  return errors;
};

const selector = formValueSelector('recordInteraction');

function mapStateToProps(state, ownProps) {
  const recordInteractionState = state.get('recordInteraction');
  return {
    // url query
    urlQuery: qs.parse(ownProps.location.search),
    // global
    // userId: state.get('global').get('user').get('id'),
    // local
    serverError: recordInteractionState.get('serverError'),
    hcps: recordInteractionState.get('hcps').toJS(),
    hcp: recordInteractionState.get('hcp') && recordInteractionState.get('hcp').toJS(),
    hcpObjectives: recordInteractionState.get('hcpObjectives').toJS(),
    projects: recordInteractionState.get('projects').toJS(),
    resources: recordInteractionState.get('resources').toJS(),
    // form selectors
    originOfInteraction: selector(state, 'origin_of_interaction'),
    isJointVisit: selector(state, 'is_joint_visit'),
    isAdverseEvent: selector(state, 'is_adverse_event'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    searchHCPs: searchHCPsActions.request,
    fetchHCP: fetchHCPActions.request,
    fetchInteractionRecordingRequiredData: fetchInteractionRecordingRequiredDataActions.request,
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
      // data.outcome = 'follow_up';
      // data.description = '...';
      props.recordInteraction(new Interaction(data));
    },
  }),
)(RecordInteraction);
