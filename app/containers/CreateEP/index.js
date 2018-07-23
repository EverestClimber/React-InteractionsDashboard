import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  Grid,
  // Col,
  // Row,
  // Button,
  // Panel,
} from 'react-bootstrap';

import { CenteredAlert } from 'components/forms';
import injectSaga from 'utils/injectSaga';
import CreateEPAddHCPs from 'containers/CreateEPAddHCPs';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  removeHCPAction,
  selectHCPsAction,
} from './actions';


class CreateEP extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    serverError: PropTypes.string,
    engagementPlan: PropTypes.object,
    selectedHCPs: PropTypes.object,
    selectHCPs: PropTypes.func,
    removeHCP: PropTypes.func,
  };

  render() {
    const {
      serverError,
      engagementPlan,
      selectedHCPs,
      selectHCPs,
      removeHCP,
    } = this.props;

    return (
      <Grid>
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
          selectedHCPs={selectedHCPs}
          selectHCPs={selectHCPs}
          removeHCP={removeHCP}
        />
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const createEPState = state.get('createEP');
  return {
    serverError: createEPState.get('serverError'),
    engagementPlan: createEPState.get('engagementPlan'),
    selectedHCPs: createEPState.get('selectedHCPs'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectHCPs: selectHCPsAction,
    removeHCP: removeHCPAction,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'createEP', reducer });
const withSaga = injectSaga({ key: 'createEP', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CreateEP);
