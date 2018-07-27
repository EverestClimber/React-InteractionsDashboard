import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { FormControl } from 'react-bootstrap';

import HCPSelector from 'components/HCPSelector';
import { CenteredAlert, Options } from 'components/forms';
import SelectedHCP from 'components/SelectedHCP';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { EngagementPlanHCPItem } from 'records/EngagementPlan';
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
    hcpItems: PropTypes.object,
    fetchHCP: PropTypes.func,
    searchHCPs: PropTypes.func,
    selectHCPs: PropTypes.func,
    removeHCP: PropTypes.func,
    updateHCPItem: PropTypes.func,
  };

  render() {
    const {
      serverError,
      hcps,
      selectedHCPs,
      hcpItems,
      fetchHCP,
      searchHCPs,
      selectHCPs,
      removeHCP,
      updateHCPItem,
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
          items={hcps}
          selectedItems={selectedHCPs}
          searchItems={searchHCPs}
          fetchItem={fetchHCP}
          removeItem={removeHCP}
          input={{ onChange: selectHCPs }}
          multiple
        />

        {!!hcpItems.size && Array.from(hcpItems.values()).map((hcpItem) => (
          <SelectedHCPWithReason
            key={hcpItem.hcp_id}
            hcp={hcpItem.hcp}
            handleRemove={() => selectHCPs(selectedHCPs.delete(hcpItem.hcp_id))}
            reason={hcpItem.reason}
            onReasonChange={(reason) => updateHCPItem(hcpItem.hcp_id, { reason })}
            reasonOther={hcpItem.reason_other}
            onReasonOtherChange={(reason_other) => updateHCPItem(hcpItem.hcp_id, { reason_other })}
          />
        ))}
      </div>
    );
  }
}

const SelectedHCPWithReason = ({ hcp, handleRemove, reason, onReasonChange, reasonOther, onReasonOtherChange }) => ( // eslint-disable-line react/prop-types
  <SelectedHCP hcp={hcp} handleRemove={handleRemove}>
    <FormControl
      componentClass="select"
      value={reason}
      onChange={(ev) => onReasonChange(ev.target.value)}
    >
      <option disabled value="">Select reason for adding HCP to the plan</option>
      <Options
        choices={Object.entries(EngagementPlanHCPItem.reason_choices)}
      />
    </FormControl>
    {(reason === 'other') && (
      <FormControl
        componentClass="textarea"
        placeholder="Other reason"
        value={reasonOther}
        onChange={(ev) => onReasonOtherChange(ev.target.value)}
      />
    )}
  </SelectedHCP>
);

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
