import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormControl,
  Button,
  Panel,
  Col,
  Row,
} from 'react-bootstrap';
import { EngagementPlanHCPItem } from 'records/EngagementPlan';
import { Options } from './forms';
import HCPSelector from './HCPSelector';
// import SelectedHCP from './SelectedHCP';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

const EPFormAddHCPs = ({
  mode,
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
      engagementPlan.hcp_items
        .map((hcpItem) => (
          <HCPItem
            key={hcpItem.hcp_id}
            {...{
              mode,
              hcpItem,
              handleRemove: () =>
                mode === 'create' || !hcpItem.id
                  ? selectHCPs(selectedHCPs.delete(hcpItem.hcp_id))
                  : updateHCPItem(hcpItem.hcp_id, {
                    removed_at: hcpItem.removed_at
                        ? null
                        : new Date().toISOString(),
                  }),
              onReasonChange: (reason) =>
                updateHCPItem(hcpItem.hcp_id, { reason }),
              onReasonOtherChange: (reason_other) =>
                updateHCPItem(hcpItem.hcp_id, { reason_other }),
              bcsfs,
              medicalPlanObjectives,
              projects,
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

EPFormAddHCPs.propTypes = {
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
  projects: PropTypes.object,
  addHCPObjective: PropTypes.func,
  updateHCPObjective: PropTypes.func,
  removeHCPObjective: PropTypes.func,
  addHCPObjectiveDeliverable: PropTypes.func,
  updateHCPObjectiveDeliverable: PropTypes.func,
  removeHCPObjectiveDeliverable: PropTypes.func,
};

export default EPFormAddHCPs;

const HCPItem = ({
  mode,
  hcpItem,
  handleRemove,
  onReasonChange,
  onReasonOtherChange,
  // objectives
  bcsfs,
  medicalPlanObjectives,
  projects,
  addHCPObjective,
  updateHCPObjective,
  removeHCPObjective,
  addHCPObjectiveDeliverable,
  updateHCPObjectiveDeliverable,
  removeHCPObjectiveDeliverable,
}) => (
  <Panel className="HCPItem">
    <Panel.Heading>
      <Button className="pull-right" onClick={handleRemove}>
        {hcpItem.removed_at ? '✔' : '✖'}
      </Button>
      <p
        style={
          hcpItem.removed_at && { textDecoration: 'line-through', color: 'red' }
        }
      >
        {hcpItem.hcp.first_name} {hcpItem.hcp.last_name}
      </p>
    </Panel.Heading>
    <Panel.Body>
      <br />
      {mode === 'create' || !hcpItem.id ? (
        <p>
          <FormControl
            componentClass="select"
            value={hcpItem.reason}
            onChange={(ev) => onReasonChange(ev.target.value)}
          >
            <option disabled value="">
              Select reason for adding HCP to the plan
            </option>
            <Options
              choices={Object.entries(EngagementPlanHCPItem.reason_choices)}
            />
          </FormControl>
          {hcpItem.reason === 'other' && (
            <FormControl
              componentClass="textarea"
              placeholder="Other reason"
              value={hcpItem.reasonOther}
              onChange={(ev) => onReasonOtherChange(ev.target.value)}
            />
          )}
        </p>
      ) : (
        <p>
          <strong>Reason{hcpItem.reason === 'other' ? ' (other)' : ''}:</strong>{' '}
          {hcpItem.reason === 'other' ? hcpItem.reasonOther : hcpItem.reason}
        </p>
      )}

      <br />
      {hcpItem.objectives.map((objective, objectiveIdx) => (
        <HCPObjective
          key={makeKey(objective, objectiveIdx)}
          {...{
            mode,
            hcpItem,
            objective,
            objectiveIdx,
            bcsfs,
            medicalPlanObjectives,
            projects,
            updateHCPObjective,
            removeHCPObjective,
            addHCPObjectiveDeliverable,
            updateHCPObjectiveDeliverable,
            removeHCPObjectiveDeliverable,
          }}
        />
      ))}

      {(mode === 'create' || !hcpItem.id) && (
        <Row className="text-center">
          <Button onClick={() => addHCPObjective(hcpItem.hcp_id)}>
            Add Objective
          </Button>
        </Row>
      )}
    </Panel.Body>
  </Panel>
);

const HCPObjective = ({
  mode,
  hcpItem,
  objective,
  objectiveIdx,
  bcsfs,
  medicalPlanObjectives,
  projects,
  updateHCPObjective,
  removeHCPObjective,
  addHCPObjectiveDeliverable,
  updateHCPObjectiveDeliverable,
  removeHCPObjectiveDeliverable,
}) => (
  <Row>
    <Col xs={10} xsOffset={1}>
      <Panel className="CreateEPAddHCPObjectives__objectives">
        <Panel.Heading>
          <Button
            className="pull-right"
            onClick={() => removeHCPObjective(hcpItem.hcp_id, objectiveIdx)}
          >
            ✖
          </Button>
          Objective
        </Panel.Heading>
        <Panel.Body>
          <br />
          <div className="CreateEPAddHCPObjectives__objective">
            {mode === 'create' || !objective.id ? (
              <FormControl
                componentClass="textarea"
                placeholder="Objective Description"
                value={objective.description}
                onChange={(ev) =>
                  updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                    description: ev.target.value,
                  })
                }
              />
            ) : (
              <p>{objective.description}</p>
            )}
            <br />
            <h5>
              <strong>Deliverables</strong>
            </h5>
            {objective.deliverables
              .map((deliverable, deliverableIdx) => (
                <div
                  key={makeKey(deliverable, deliverableIdx)}
                  className="CreateEPAddHCPObjectives__deliverable"
                >
                  <FormGroup>
                    <Row>
                      <Col xs={1}>
                        <FormControl
                          type="text"
                          placeholder="Q#"
                          value={deliverable.quarter}
                          onChange={(ev) =>
                            updateHCPObjectiveDeliverable(
                              hcpItem.hcp_id,
                              objectiveIdx,
                              deliverableIdx,
                              { quarter: +ev.target.value }
                            )
                          }
                          disabled={mode === 'update' && objective.id}
                        />
                      </Col>
                      <Col xs={10}>
                        <FormControl
                          type="text"
                          placeholder="Deliverable description"
                          value={deliverable.description}
                          onChange={(ev) =>
                            updateHCPObjectiveDeliverable(
                              hcpItem.hcp_id,
                              objectiveIdx,
                              deliverableIdx,
                              { description: ev.target.value }
                            )
                          }
                          disabled={mode === 'update' && objective.id}
                        />
                      </Col>
                      <Col xs={1}>
                        {(mode === 'create' || !objective.id) && (
                          <Button
                            onClick={() =>
                              removeHCPObjectiveDeliverable(
                                hcpItem.hcp_id,
                                objectiveIdx,
                                deliverableIdx
                              )
                            }
                          >
                            ✖
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </FormGroup>
                </div>
              ))
              .toJS()}
            {(mode === 'create' || !objective.id) && (
              <Row className="text-center">
                <Button
                  onClick={() =>
                    addHCPObjectiveDeliverable(hcpItem.hcp_id, objectiveIdx)
                  }
                >
                  Add Deliverable
                </Button>
              </Row>
            )}
            <br />
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
          </div>
        </Panel.Body>
      </Panel>
    </Col>
  </Row>
);
