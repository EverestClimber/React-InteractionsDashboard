import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  FormControl,
  FormGroup,
  Button,
  Col,
  Row,
} from 'react-bootstrap';
import { EngagementPlanHCPItem } from 'records/EngagementPlan';
import { EPFormObjective } from 'components/EPFormObjective';
import Comment from 'components/Comment';
import { HCPDeliverable } from 'records/HCPObjective';
import { EPFormPlanItem } from 'components/EPFormPlanItem';
import { Options } from './forms';
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
          <EPFormPlanItem
            key={hcpItem.hcp_id}
            {...{
              className: 'EPForm__HCPItem',
              planItem: hcpItem,
              title: (
                <div className="title">
                  {hcpItem.hcp.first_name} {hcpItem.hcp.last_name}
                  <Badge className="status">STATUS</Badge>
                  <Badge className="objscount">
                    {hcpItem.objectives.size} OBJECTIVES
                  </Badge>
                </div>
              ),
              remove: () => selectHCPs(selectedHCPs.delete(hcpItem.hcp_id)),
              setRemoved: () =>
                updateHCPItem(hcpItem.hcp_id, {
                  removed_at: new Date().toISOString(),
                }),
              unsetRemoved: () =>
                updateHCPItem(hcpItem.hcp_id, { removed_at: null }),
              onReasonRemovedChange: (reason_removed) =>
                updateHCPItem(hcpItem.hcp_id, { reason_removed }),
            }}
          >
            {hcpItem.comments.map((comment) => (
              <Comment comment={comment} key={comment.id} />
            ))}
            {mode === 'create' || !hcpItem.id ? (
              <div>
                <FormGroup
                  validationState={
                    (fieldsTouched.get(`hcp_items.${hcpItemIdx}.reason`) ||
                      showAllStepErrors) &&
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
                      choices={Object.entries(
                        EngagementPlanHCPItem.reason_choices
                      )}
                    />
                  </FormControl>
                </FormGroup>
                {hcpItem.reason === 'other' && (
                  <FormGroup
                    validationState={
                      (fieldsTouched.get(
                        `hcp_items.${hcpItemIdx}.reason_other`
                      ) ||
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
              <p>
                <strong>
                  Reason{hcpItem.reason === 'other' ? ' (other)' : ''}:
                </strong>{' '}
                {hcpItem.reason === 'other'
                  ? hcpItem.reasonOther
                  : hcpItem.reason}
              </p>
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
                  fieldsErrors,
                  fieldsTouched,
                  showAllStepErrors,
                  objective,
                  objectiveIdx,
                  updateObjective: updateHCPObjective,
                  removeObjective: removeHCPObjective,
                  addDeliverable: addHCPObjectiveDeliverable,
                  updateDeliverable: updateHCPObjectiveDeliverable,
                  removeDeliverable: removeHCPObjectiveDeliverable,
                  deliverableStatusChoices: HCPDeliverable.status_choices,
                }}
              >
                <Row>
                  <br />
                </Row>
                <Row>
                  <Col sm={4}>
                    <FormControl
                      componentClass="select"
                      value={objective.medical_plan_objective_id || ''}
                      onChange={(ev) =>
                        updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                          medical_plan_objective_id: +ev.target.value || '',
                        })
                      }
                      disabled={mode === 'update' && objective.id}
                    >
                      <option value="">- Medical Plan Objective -</option>
                      <Options
                        choices={Array.from(medicalPlanObjectives.values()).map(
                          (it) => [it.id, it.name]
                        )}
                      />
                    </FormControl>
                  </Col>
                  <Col sm={4}>
                    <FormControl
                      componentClass="select"
                      value={objective.project_id || ''}
                      onChange={(ev) =>
                        updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                          project_id: +ev.target.value || '',
                        })
                      }
                      disabled={mode === 'update' && objective.id}
                    >
                      <option value="">- Project -</option>
                      <Options
                        choices={Array.from(projects.values()).map((it) => [
                          it.id,
                          it.title,
                        ])}
                      />
                    </FormControl>
                  </Col>
                  <Col sm={4}>
                    <FormControl
                      componentClass="select"
                      value={objective.bcsf_id || ''}
                      onChange={(ev) =>
                        updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                          bcsf_id: +ev.target.value || '',
                        })
                      }
                      disabled={mode === 'update' && objective.id}
                    >
                      <option value={null}>- Critical Success Factor -</option>
                      <Options
                        choices={Array.from(bcsfs.values()).map((it) => [
                          it.id,
                          it.name,
                        ])}
                      />
                    </FormControl>
                  </Col>
                </Row>
              </EPFormObjective>
            ))}

            {(mode === 'create' || !hcpItem.id) && (
              <Row className="text-center">
                <Button onClick={() => addHCPObjective(hcpItem.hcp_id)}>
                  Add Objective
                </Button>
              </Row>
            )}
          </EPFormPlanItem>
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
