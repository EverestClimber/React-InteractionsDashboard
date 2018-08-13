import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Button,
  Row,
} from 'react-bootstrap';
import * as classNames from 'classnames';
import { EngagementPlanHCPItem } from 'records/EngagementPlan';
import { EPFormObjective } from 'components/EPFormObjective';
import { HCPDeliverable } from 'records/HCPObjective';
import { EPFormPlanItem } from 'components/EPFormPlanItem';
import { Options, SearchSelect } from './forms';
import HCPSelector from './HCPSelector';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

const EPFormHCPs = ({
  mode,
  currentQuarter,
  hcps,
  selectedHCPs,
  engagementPlan,
  fetchHCP,
  searchHCPs,
  selectHCPs,
  removeHCP,
  updateHCPItem,
  // objectives:
  bcsfs,
  medicalPlanObjectives,
  projects,
  addHCPObjective,
  updateHCPObjective,
  removeHCPObjective,
  addHCPObjectiveDeliverable,
  updateHCPObjectiveDeliverable,
  removeHCPObjectiveDeliverable,
  // validation
  fieldsErrors,
  fieldsTouched,
  showAllStepErrors,
}) => (
  <div className="EPFormHCPs EPForm__step">
    <HCPSelector
      items={hcps.toJS()}
      selectedItems={selectedHCPs}
      searchItems={searchHCPs}
      fetchItem={fetchHCP}
      removeItem={removeHCP}
      input={{ onChange: selectHCPs }}
      multiple
    />

    <h2 className="EPForm__step__title">
      My HCPs <Badge>{selectedHCPs.size}</Badge>
    </h2>

    {!!engagementPlan.hcp_items.size &&
      engagementPlan.hcp_items
        .map((hcpItem, hcpItemIdx) => (
          <EPHCPItem
            key={hcpItem.hcp_id}
            {...{
              mode,
              currentQuarter,
              hcpItem,
              hcpItemIdx,
              medicalPlanObjectives,
              projects,
              bcsfs,
              // for create/edit mode:
              updateHCPItem,
              selectHCPs,
              selectedHCPs,
              fieldsTouched,
              fieldsErrors,
              showAllStepErrors,
              addHCPObjective,
              updateHCPObjective,
              removeHCPObjective,
              addHCPObjectiveDeliverable,
              updateHCPObjectiveDeliverable,
              removeHCPObjectiveDeliverable,
            }}
          />
        ))
        .toJS()}
  </div>
);

EPFormHCPs.propTypes = {
  mode: PropTypes.string,
  currentQuarter: PropTypes.number,
  hcps: PropTypes.object,
  selectedHCPs: PropTypes.object,
  engagementPlan: PropTypes.object,
  fetchHCP: PropTypes.func,
  searchHCPs: PropTypes.func,
  selectHCPs: PropTypes.func,
  removeHCP: PropTypes.func,
  updateHCPItem: PropTypes.func,
  // objectives:
  bcsfs: PropTypes.object,
  medicalPlanObjectives: PropTypes.object,
  addHCPObjective: PropTypes.func,
  updateHCPObjective: PropTypes.func,
  removeHCPObjective: PropTypes.func,
  addHCPObjectiveDeliverable: PropTypes.func,
  updateHCPObjectiveDeliverable: PropTypes.func,
  removeHCPObjectiveDeliverable: PropTypes.func,
  // validation
  fieldsErrors: PropTypes.object,
  fieldsTouched: PropTypes.object,
  showAllStepErrors: PropTypes.bool,
};

export default EPFormHCPs;

export const EPHCPItem = ({
  mode,
  currentQuarter,
  hcpItem,
  hcpItemIdx,
  updateHCPItem,
  selectHCPs,
  selectedHCPs,
  fieldsTouched,
  fieldsErrors,
  showAllStepErrors,
  addHCPObjective,
  updateHCPObjective,
  removeHCPObjective,
  addHCPObjectiveDeliverable,
  updateHCPObjectiveDeliverable,
  removeHCPObjectiveDeliverable,
  medicalPlanObjectives,
  projects,
  bcsfs,
}) => {
  const wasUpdated = (itemIdx) =>
    fieldsTouched
      .keySeq()
      .find((fieldName) => fieldName.indexOf(`hcp_items.${itemIdx}`) !== -1);

  const getStatuses = (item, itemIdx) => {
    const statuses = {};
    if (!item.id) statuses.new = 1;
    if (wasUpdated(itemIdx)) statuses.updated = 1;
    if (item.approved) statuses.approved = 1;
    if (item.comments.size) statuses.commented = 1;
    return Object.keys(statuses);
  };

  return (
    <EPFormPlanItem
      {...{
        mode,
        className: 'EPForm__HCPItem',
        planItem: hcpItem,
        title: (
          <div className="EPForm__HCPItem__title">
            {hcpItem.hcp.first_name} {hcpItem.hcp.last_name}
            {getStatuses(hcpItem, hcpItemIdx).map((status) => (
              <Badge
                key={status}
                className={classNames({
                  status: true,
                  [`status--${status}`]: true,
                })}
              >
                {status.toUpperCase()}
              </Badge>
            ))}
            <Badge className="objscount">
              {hcpItem.objectives.size} OBJECTIVES
            </Badge>
            <div className="pull-right">
              <div className="location">
                <span className="icon-hcp-location" />
                <span className="location__city">{hcpItem.hcp.city}</span>
                {', '}
                <span className="location__country">{hcpItem.hcp.country}</span>
              </div>
              <div className="institution_name">
                <span className="icon-hcp-hospital" />{' '}
                {hcpItem.hcp.institution_name}
              </div>
            </div>
            <div className="tas">{hcpItem.hcp.ta_names.join(', ')}</div>
          </div>
        ),
        remove: () => selectHCPs(selectedHCPs.delete(hcpItem.hcp_id)),
        setRemoved: () =>
          updateHCPItem(hcpItem.hcp_id, {
            removed_at: new Date().toISOString(),
          }),
        unsetRemoved: () => updateHCPItem(hcpItem.hcp_id, { removed_at: null }),
        onReasonRemovedChange: (reason_removed) =>
          updateHCPItem(hcpItem.hcp_id, { reason_removed }),
      }}
    >
      {mode === 'create' || (!hcpItem.id && mode !== 'view') ? (
        <div>
          <FormGroup
            validationState={
              (fieldsTouched.get(`hcp_items.${hcpItemIdx}.reason`) ||
                showAllStepErrors) &&
              fieldsErrors &&
              fieldsErrors.get(`hcp_items.${hcpItemIdx}.reason`)
                ? 'error'
                : null
            }
          >
            <FormControl
              componentClass="select"
              value={hcpItem.reason}
              onChange={(ev) =>
                updateHCPItem(hcpItem.hcp_id, {
                  reason: ev.target.value,
                })
              }
            >
              <option disabled value="">
                Select reason for adding HCP to the plan
              </option>
              <Options
                choices={Object.entries(EngagementPlanHCPItem.reason_choices)}
              />
            </FormControl>
          </FormGroup>
          {hcpItem.reason === 'other' && (
            <FormGroup
              validationState={
                (fieldsTouched.get(`hcp_items.${hcpItemIdx}.reason_other`) ||
                  showAllStepErrors) &&
                fieldsErrors.get(`hcp_items.${hcpItemIdx}.reason_other`)
                  ? 'error'
                  : null
              }
            >
              <FormControl
                componentClass="textarea"
                placeholder="Other reason"
                value={hcpItem.reason_other}
                onChange={(ev) =>
                  updateHCPItem(hcpItem.hcp_id, {
                    reason_other: ev.target.value,
                  })
                }
              />
            </FormGroup>
          )}
        </div>
      ) : (
        <div className="EPForm__PlanItem__section">
          <div className="EPForm__PlanItem__section__heading">
            REASON
            {hcpItem.reason === 'other' ? ' (OTHER)' : ''}
          </div>
          <div className="EPForm__PlanItem__section__body">
            {hcpItem.reason === 'other' ? hcpItem.reasonOther : hcpItem.reason}
          </div>
        </div>
      )}

      <br />
      {hcpItem.objectives.map((objective, objectiveIdx) => (
        <EPFormObjective
          key={makeKey(objective, objectiveIdx)}
          {...{
            mode,
            hideRemove: hcpItem.objectives.size <= 1,
            currentQuarter,
            itemObjectId: hcpItem.hcp_id,
            fieldPrefix: `hcp_items.${hcpItemIdx}`,
            objective,
            objectiveIdx,
            deliverableStatusChoices: HCPDeliverable.status_choices,
            fieldsTouched,
            // for create/edit mode:
            fieldsErrors,
            showAllStepErrors,
            updateObjective: updateHCPObjective,
            removeObjective: removeHCPObjective,
            addDeliverable: addHCPObjectiveDeliverable,
            updateDeliverable: updateHCPObjectiveDeliverable,
            removeDeliverable: removeHCPObjectiveDeliverable,
          }}
        >
          <Row>
            <Col sm={4}>
              <FormGroup
                validationState={
                  (fieldsTouched.get(
                    `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.medical_plan_objective_id`
                  ) ||
                    showAllStepErrors) &&
                  fieldsErrors.get(
                    `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.medical_plan_objective_id`
                  )
                    ? 'error'
                    : null
                }
              >
                <ControlLabel>MEDICAL PLAN OBJECTIVE</ControlLabel>
                {objective.id || mode === 'view' ? (
                  <div className="selection">
                    {(objective.medical_plan_objective_id &&
                      medicalPlanObjectives.getIn([
                        objective.medical_plan_objective_id,
                        'name',
                      ])) ||
                      '-'}
                  </div>
                ) : (
                  <SearchSelect
                    input={{
                      value: objective.medical_plan_objective_id || '',
                      onChange: (val) =>
                        updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                          medical_plan_objective_id: +val || '',
                        }),
                    }}
                    disabled={mode === 'update' && objective.id}
                    options={Array.from(medicalPlanObjectives.values()).map(
                      (it) => ({ value: it.id, label: it.name })
                    )}
                  />
                )}
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup
                validationState={
                  (fieldsTouched.get(
                    `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.project_id`
                  ) ||
                    showAllStepErrors) &&
                  fieldsErrors.get(
                    `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.project_id`
                  )
                    ? 'error'
                    : null
                }
              >
                <ControlLabel>PROJECT</ControlLabel>
                {objective.id || mode === 'view' ? (
                  <div className="selection">
                    {(objective.project_id &&
                      projects.getIn([objective.project_id, 'title'])) ||
                      '-'}
                  </div>
                ) : (
                  <SearchSelect
                    input={{
                      value: objective.project_id || '',
                      onChange: (val) =>
                        updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                          project_id: +val || '',
                        }),
                    }}
                    disabled={mode === 'update' && objective.id}
                    options={Array.from(projects.values()).map((it) => ({
                      value: it.id,
                      label: it.title,
                    }))}
                  />
                )}
              </FormGroup>
            </Col>
            <Col sm={4}>
              <FormGroup
                validationState={
                  (fieldsTouched.get(
                    `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.bcsf_id`
                  ) ||
                    showAllStepErrors) &&
                  fieldsErrors.get(
                    `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.bcsf_id`
                  )
                    ? 'error'
                    : null
                }
              >
                <ControlLabel>BRAND CRITICAL SUCCESS FACTOR</ControlLabel>
                {objective.id || mode === 'view' ? (
                  <div className="selection">
                    {(objective.bcsf_id &&
                      bcsfs.getIn([objective.bcsf_id, 'name'])) ||
                      '-'}
                  </div>
                ) : (
                  <SearchSelect
                    input={{
                      value: objective.bcsf_id || '',
                      onChange: (val) =>
                        updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                          bcsf_id: +val || '',
                        }),
                    }}
                    disabled={mode === 'update' && objective.id}
                    options={Array.from(bcsfs.values()).map((it) => ({
                      value: it.id,
                      label: it.name,
                    }))}
                  />
                )}
              </FormGroup>
            </Col>
          </Row>
        </EPFormObjective>
      ))}

      {(mode === 'create' || !hcpItem.id) && (
        <Row className="text-center EPForm__PlanItem__addObjective">
          <Button onClick={() => addHCPObjective(hcpItem.hcp_id)}>
            <span className="icon-button-new-objective" /> New Objective
          </Button>
        </Row>
      )}
    </EPFormPlanItem>
  );
};
