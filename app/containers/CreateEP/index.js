/**
 *
 * CreateEp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { CenteredAlert } from 'components/forms';
import injectSaga from 'utils/injectSaga';
import CreateEPAddHCPs from 'containers/CreateEPAddHCPs';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';


export class CreateEP extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    serverError: PropTypes.string,
    engagementPlan: PropTypes.object,
  };

  render() {
    const {
      serverError,
      engagementPlan,
    } = this.props;

    return (
      <div>
        <h2>Create Engagement Plan</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        <hr />
        <CreateEPAddHCPs
          engagementPlan={engagementPlan}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const createEPState = state.get('createEP');
  return {
    serverError: createEPState.get('serverError'),
    engagementPlan: createEPState.get('engagementPlan'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'createEP', reducer });
const withSaga = injectSaga({ key: 'createEP', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CreateEP);
