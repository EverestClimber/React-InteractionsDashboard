import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';

export class CreateEPAddHCPs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    engagementPlan: PropTypes.func.object,
  };

  render() {
    return (
      <div>
        <h2>Step 1: Add HCPs</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const createEPState = state.get('createEP');
  return {
    serverError: createEPState.get('serverError'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'CreateEPAddHCPs', reducer });
const withSaga = injectSaga({ key: 'CreateEPAddHCPs', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CreateEPAddHCPs);
