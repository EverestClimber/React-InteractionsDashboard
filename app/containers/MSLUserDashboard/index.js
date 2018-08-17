import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Grid, Row, Panel } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

export class MSLUserDashboard extends React.PureComponent {
  render() {
    return (
      <Grid>
        <Row>
          <h2>MSL Interactions - Dashboard</h2>
          <Panel>
            <Panel.Body>
              <p>Coming soon...</p>
            </Panel.Body>
          </Panel>
        </Row>
      </Grid>
    );
  }
}

MSLUserDashboard.propTypes = {
  user: PropTypes.object,
  engagementPlan: PropTypes.object,
};

function mapStateToProps(state) {
  const componentState = state.get('mslUserDashboard');
  return {
    user: state.get('global').get('user'),
    engagementPlan: componentState.get('engagementPlan'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchCurrentEP: actions.fetchCurrentEPActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'mslUserDashboard', reducer });
const withSaga = injectSaga({ key: 'mslUserDashboard', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(MSLUserDashboard);
