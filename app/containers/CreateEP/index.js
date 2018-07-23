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
import CreateEPAddHCPObjectives from 'components/CreateEPAddHCPObjectives';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  removeHCPAction,
  selectHCPsAction,
  updateHCPItemAction,
  addHCPObjectiveAction,
  updateHCPObjectiveAction,
  removeHCPObjectiveAction,
  addHCPObjectiveDeliverableAction,
  updateHCPObjectiveDeliverableAction,
  removeHCPObjectiveDeliverableAction,
} from './actions';


class CreateEP extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    serverError: PropTypes.string,
    engagementPlan: PropTypes.object,
    selectedHCPs: PropTypes.object,
    selectHCPs: PropTypes.func,
    removeHCP: PropTypes.func,
    updateHCPItem: PropTypes.func,
    addHCPObjective: PropTypes.func,
    updateHCPObjective: PropTypes.func,
    removeHCPObjective: PropTypes.func,
    addHCPObjectiveDeliverable: PropTypes.func,
    updateHCPObjectiveDeliverable: PropTypes.func,
    removeHCPObjectiveDeliverable: PropTypes.func,
  };

  render() {
    const {
      serverError,
      engagementPlan,
      selectedHCPs,
      selectHCPs,
      removeHCP,
      updateHCPItem,
      addHCPObjective,
      updateHCPObjective,
      removeHCPObjective,
      addHCPObjectiveDeliverable,
      updateHCPObjectiveDeliverable,
      removeHCPObjectiveDeliverable,
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
          selectedHCPs={selectedHCPs}
          selectHCPs={selectHCPs}
          removeHCP={removeHCP}
          hcpItems={engagementPlan.hcp_items}
          updateHCPItem={updateHCPItem} // (hcpId, data)
        />

        <hr />
        <CreateEPAddHCPObjectives
          selectedHCPs={selectedHCPs}
          hcpItems={engagementPlan.hcp_items}
          addHCPObjective={addHCPObjective} // (hcpId)
          updateHCPObjective={updateHCPObjective} // (hcpId, idx, data)
          removeHCPObjective={removeHCPObjective} // (hcpId, idx)
          addDeliverable={addHCPObjectiveDeliverable} // (hcpId, objectiveIdx)
          updateDeliverable={updateHCPObjectiveDeliverable} // (hcpId, objectiveIdx, deliverableIdx, data)
          removeDeliverable={removeHCPObjectiveDeliverable} // (hcpId, objectiveIdx, deliverableIdx)
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
    updateHCPItem: updateHCPItemAction,
    addHCPObjective: addHCPObjectiveAction,
    updateHCPObjective: updateHCPObjectiveAction,
    removeHCPObjective: removeHCPObjectiveAction,
    addHCPObjectiveDeliverable: addHCPObjectiveDeliverableAction,
    updateHCPObjectiveDeliverable: updateHCPObjectiveDeliverableAction,
    removeHCPObjectiveDeliverable: removeHCPObjectiveDeliverableAction,
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
