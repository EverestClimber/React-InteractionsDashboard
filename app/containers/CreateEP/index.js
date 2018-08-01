import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { CenteredAlert } from 'components/forms';
import EPForm from 'containers/EPForm';
import { EngagementPlan } from 'records/EngagementPlan';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

export class CreateEP extends React.Component {
  render() {
    return (
      <Grid>
        <h2>Create Engagement Plan</h2>
        <br />

        {this.props.serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{this.props.serverError}</pre>
          </CenteredAlert>
        )}

        <EPForm
          mode="create"
          onSubmit={this.props.createEP}
          initEngagementPlan={new EngagementPlan()}
        />
      </Grid>
    );
  }
}

CreateEP.propTypes = {
  serverError: PropTypes.string,
  engagementPlan: PropTypes.object,
  createEP: PropTypes.func,
};

function mapStateToProps(state) {
  const createEPState = state.get('createEP');
  return {
    serverError: createEPState.get('serverError'),
    engagementPlan: createEPState.get('engagementPlan'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createEP: actions.createEPActions.request,
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
