import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { CenteredAlert } from 'components/forms';
import EPForm from 'containers/EPForm';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

export class UpdateEP extends React.Component {
  componentDidMount() {
    console.log('% UpdateEP.componentDidMount');
    // console.log('PROPS:', this.props);
    this.props.fetchEP(this.props.match.params.engagementPlanId);
  }

  render() {
    console.log('% UpdateEP.render');
    return (
      <Grid>
        <h2>Update Engagement Plan</h2>
        <br />

        {this.props.serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{this.props.serverError}</pre>
          </CenteredAlert>
        )}

        <EPForm
          onSubmit={() => this.props.updateEP(this.props.engagementPlan)}
          initEngagementPlan={this.props.engagementPlan}
        />
      </Grid>
    );
  }
}

UpdateEP.propTypes = {
  serverError: PropTypes.string,
  engagementPlan: PropTypes.object,
  updateEP: PropTypes.func,
  fetchEP: PropTypes.func,
};

function mapStateToProps(state) {
  const updateEPState = state.get('updateEP');
  return {
    serverError: updateEPState.get('serverError'),
    engagementPlan: updateEPState.get('engagementPlan'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEP: actions.updateEPActions.request,
      fetchEP: actions.fetchEPActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'updateEP', reducer });
const withSaga = injectSaga({ key: 'updateEP', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(UpdateEP);
