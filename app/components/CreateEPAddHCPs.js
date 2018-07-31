import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import { EngagementPlanHCPItem } from 'records/EngagementPlan';
import { Options } from './forms';
import HCPSelector from './HCPSelector';
import SelectedHCP from './SelectedHCP';

const CreateEPAddHCPs = ({
  hcps,
  selectedHCPs,
  engagementPlan,
  fetchHCP,
  searchHCPs,
  selectHCPs,
  removeHCP,
  updateHCPItem,
}) => (
  <div>
    <h2>Step 1: Add HCPs</h2>

    <HCPSelector
      items={hcps.toJS()}
      selectedItems={selectedHCPs}
      searchItems={searchHCPs}
      fetchItem={fetchHCP}
      removeItem={removeHCP}
      input={{ onChange: selectHCPs }}
      multiple
    />

    {!!engagementPlan.hcp_items.size &&
      Array.from(engagementPlan.hcp_items.values()).map((hcpItem) => (
        <SelectedHCPWithReason
          key={hcpItem.hcp_id}
          hcp={hcpItem.hcp}
          handleRemove={() => selectHCPs(selectedHCPs.delete(hcpItem.hcp_id))}
          reason={hcpItem.reason}
          onReasonChange={(reason) => updateHCPItem(hcpItem.hcp_id, { reason })}
          reasonOther={hcpItem.reason_other}
          onReasonOtherChange={(reason_other) =>
            updateHCPItem(hcpItem.hcp_id, { reason_other })
          }
        />
      ))}
  </div>
);

CreateEPAddHCPs.propTypes = {
  hcps: PropTypes.object,
  selectedHCPs: PropTypes.object,
  engagementPlan: PropTypes.object,
  fetchHCP: PropTypes.func,
  searchHCPs: PropTypes.func,
  selectHCPs: PropTypes.func,
  removeHCP: PropTypes.func,
  updateHCPItem: PropTypes.func,
};

export default CreateEPAddHCPs;

const SelectedHCPWithReason = (
  {
    hcp,
    handleRemove,
    reason,
    onReasonChange,
    reasonOther,
    onReasonOtherChange,
  } // eslint-disable-line react/prop-types
) => (
  <SelectedHCP hcp={hcp} handleRemove={handleRemove}>
    <FormControl
      componentClass="select"
      value={reason}
      onChange={(ev) => onReasonChange(ev.target.value)}
    >
      <option disabled value="">
        Select reason for adding HCP to the plan
      </option>
      <Options choices={Object.entries(EngagementPlanHCPItem.reason_choices)} />
    </FormControl>
    {reason === 'other' && (
      <FormControl
        componentClass="textarea"
        placeholder="Other reason"
        value={reasonOther}
        onChange={(ev) => onReasonOtherChange(ev.target.value)}
      />
    )}
  </SelectedHCP>
);
