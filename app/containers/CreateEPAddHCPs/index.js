import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

import HCPSelector from 'components/HCPSelector';
import { CenteredAlert } from 'components/forms';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  fetchHCPActions,
  searchHCPsActions,
} from './actions';

class CreateEPAddHCPs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    serverError: PropTypes.string,
    hcps: PropTypes.array,
    selectedHCPs: PropTypes.object,
    fetchHCP: PropTypes.func,
    searchHCPs: PropTypes.func,
    selectHCPs: PropTypes.func,
    removeHCP: PropTypes.func,
  };

  render() {
    const {
      serverError,
      hcps,
      selectedHCPs,
      fetchHCP,
      searchHCPs,
      selectHCPs,
      removeHCP,
    } = this.props;

    return (
      <div>
        <h2>Step 1: Add HCPs</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        <HCPSelector
          hcps={hcps}
          selectedHCPs={selectedHCPs}
          searchHCPs={searchHCPs}
          fetchHCP={fetchHCP}
          removeHCP={removeHCP}
          input={{ onChange: selectHCPs }}
          multiple
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const createEPAddHCPsState = state.get('createEPAddHCPs');
  return {
    serverError: createEPAddHCPsState.get('serverError'),
    hcps: createEPAddHCPsState.get('hcps').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchHCP: fetchHCPActions.request,
    searchHCPs: searchHCPsActions.request,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'createEPAddHCPs', reducer });
const withSaga = injectSaga({ key: 'createEPAddHCPs', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CreateEPAddHCPs);
