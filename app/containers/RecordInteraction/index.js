import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Field, reduxForm } from 'redux-form/immutable';
import { Button } from 'reactstrap';

import Interaction from 'records/interaction';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

import {
  fetchInteractionActions,
  recordInteractionActions,
} from './actions';

const renderCheckbox = ({ name, label, ...rest }) => {
  const { input } = rest;
  return (
    <label htmlFor={name}>
      <input type="checkbox" id={name} name={name} {...input} />
      {label}
    </label>
  );
};

renderCheckbox.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};

export class RecordInteraction extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func,
    fetchRecordInteraction: PropTypes.func,
    userId: PropTypes.number,
    hcps: PropTypes.instanceOf(List),
    hcpObjectives: PropTypes.instanceOf(List),
    projects: PropTypes.instanceOf(List),
    resources: PropTypes.instanceOf(List),
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
    } = this.props;
    return (
      <div>
        <Helmet>
          <title>OTSK - Record Interaction</title>
        </Helmet>
        <form onSubmit={handleSubmit}>
          <div>
            <span>HCP</span>
            <Field
              name="hcp_id"
              component="select"
            >
              {hcps.map((hcp) => (
                <option
                  key={hcp.get('id') + hcp.get('last_name')}
                  value={hcp.get('id')}
                >
                  {`${hcp.get('first_name')} ${hcp.get('last_name')}`}
                </option>
              ))}
            </Field>
          </div>
          <div>
            <span>Resources</span>
            <Field
              name="resource"
              component="select"
            >
              {resources.map((resource) => (
                <option
                  key={resource.get('id') + resource.get('name')}
                  value={resource.get('id')}
                >
                  {resource.get('name')}
                </option>
              ))}
            </Field>
          </div>
          <div>
            <span>HCP Objective</span>
            <Field
              name="hcp_objective_id"
              component="select"
            >
              {hcpObjectives.map((objective) => (
                <option
                  key={objective.get('id')}
                  value={objective.get('id')}
                >
                  {objective.get('description')}
                </option>
              ))}
            </Field>
          </div>
          <div>
            <span>Type of Interaction</span>
            <Field
              name="type_of_interaction"
              component="select"
            >
              {Interaction.typeOfInteraction.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.name}
                </option>
              ))}
            </Field>
          </div>
          <div>
            <span>Project</span>
            <Field
              name="project_id"
              component="select"
            >
              {projects.map((project) => (
                <option
                  key={project.get('id')}
                  value={project.get('id')}
                >
                  {project.get('title')}
                </option>
              ))}
            </Field>
          </div>
          <div>
            <span>Origin of Interaction</span>
            <Field
              name="origin_of_interaction"
              component="select"
            >
              {Interaction.originOfInteraction.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.name}
                </option>
              ))}
            </Field>
            <Field
              type="text"
              name="origin_of_interaction_other"
              placeholder="Origin Other"
              component="input"
            />
          </div>
          <div>
            <Field
              name="consent"
              component={renderCheckbox}
              label="HCP Consent Received"
            />
          </div>
          <div>
            <Field
              name="purpose"
              type="text"
              placeholder="Purpose"
              component="input"
            />
          </div>
          <div>
            <Field
              name="is_joint_visit"
              component={renderCheckbox}
              label="Joint Visit"
            />
            <Field
              name="joint_visit_with"
              type="text"
              placeholder="Who With"
              component="input"
            />
          </div>
          <div>
            <Field
              name="is_adverse_event"
              component={renderCheckbox}
              label="Adverse Event"
            />
          </div>
          <div>
            <Field
              name="appropriate_procedures_followed"
              component={renderCheckbox}
              label="Appropriate PV Procedures Followed"
            />
          </div>
          <div>
            <Field
              name="is_follow_up_required"
              component={renderCheckbox}
              label="Follow up required"
            />
          </div>
          <div>
            <Field
              name="description"
              type="text"
              placeholder="Description"
              component="textarea"
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const recordInteractionState = state.get('recordInteraction');
  return {
    userId: state.get('global').get('user').get('id'),
    hcps: recordInteractionState.get('hcps'),
    hcpObjectives: recordInteractionState.get('hcpObjectives'),
    projects: recordInteractionState.get('projects'),
    resources: recordInteractionState.get('resources'),
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
    onSubmit: (data, dispatch, props) => {
      props.recordInteraction(new Interaction(data));
    },
  }),
)(RecordInteraction);
