import React from 'react';
import {
  FormControl,
  FormGroup,
  Row,
  Col,
  Button,
  Panel,
} from 'react-bootstrap';
import { Options } from './forms';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

export const EPFormObjective = ({
  mode,
  hideRemove,
  currentQuarter,
  itemObjectId,
  objective,
  objectiveIdx,
  updateObjective,
  removeObjective,
  addDeliverable,
  updateDeliverable,
  removeDeliverable,
  deliverableStatusChoices,
  fieldPrefix,
  fieldsErrors,
  fieldsTouched,
  showAllStepErrors,
  children,
}) => (
  <Row className="EPFormObjective">
    <Col xs={10} xsOffset={1}>
      <Panel>
        <Panel.Heading className="EPFormObjective__heading">
          {(mode === 'create' || !objective.id) &&
            !hideRemove && (
              <Button
                className="pull-right"
                onClick={() => removeObjective(itemObjectId, objectiveIdx)}
              >
                ✖
              </Button>
            )}
          Objective
        </Panel.Heading>
        <Panel.Body className="EPFormObjective__body">
          <br />
          {mode === 'create' || !objective.id ? (
            <FormGroup
              validationState={
                (fieldsTouched.get(
                  `${fieldPrefix}.objectives.${objectiveIdx}.description`
                ) ||
                  showAllStepErrors) &&
                fieldsErrors.get(
                  `${fieldPrefix}.objectives.${objectiveIdx}.description`
                )
                  ? 'error'
                  : null
              }
            >
              <FormControl
                componentClass="textarea"
                placeholder="Objective Description"
                value={objective.description}
                onChange={(ev) =>
                  updateObjective(itemObjectId, objectiveIdx, {
                    description: ev.target.value,
                  })
                }
              />
            </FormGroup>
          ) : (
            <p>{objective.description}</p>
          )}
          <br />
          <h5>
            <strong>Deliverables</strong>
          </h5>
          {objective.deliverables.map((deliverable, deliverableIdx) => (
            <EPFormDeliverable
              key={makeKey(deliverable, deliverableIdx)}
              {...{
                mode,
                hideRemove: objective.deliverables.size <= 1,
                currentQuarter,
                itemObjectId,
                objective,
                objectiveIdx,
                deliverable,
                deliverableIdx,
                deliverableStatusChoices,
                updateDeliverable,
                removeDeliverable,
                fieldPrefix,
                fieldsErrors,
                fieldsTouched,
                showAllStepErrors,
              }}
            />
          ))}
          {(mode === 'create' || !objective.id) && (
            <Row className="text-center">
              <Button
                onClick={() => addDeliverable(itemObjectId, objectiveIdx)}
              >
                Add Deliverable
              </Button>
            </Row>
          )}

          {children}
        </Panel.Body>
      </Panel>
    </Col>
  </Row>
);

export const EPFormDeliverable = ({
  mode,
  hideRemove,
  currentQuarter,
  itemObjectId,
  objective,
  objectiveIdx,
  deliverable,
  deliverableIdx,
  deliverableStatusChoices,
  updateDeliverable,
  removeDeliverable,
  fieldPrefix,
  fieldsErrors,
  fieldsTouched,
  showAllStepErrors,
}) => (
  <div
    key={makeKey(deliverable, deliverableIdx)}
    className="EPFormObjective__deliverable"
  >
    <FormGroup>
      <Row>
        <Col xs={1}>
          <FormControl
            componentClass="select"
            value={deliverable.quarter}
            onChange={(ev) =>
              updateDeliverable(itemObjectId, objectiveIdx, deliverableIdx, {
                quarter: +ev.target.value,
              })
            }
            disabled={mode === 'update' && objective.id}
          >
            <option value={1} disabled={currentQuarter > 1}>
              1
            </option>
            <option value={2} disabled={currentQuarter > 2}>
              2
            </option>
            <option value={3} disabled={currentQuarter > 3}>
              3
            </option>
            <option value={4}>4</option>
          </FormControl>
        </Col>
        <Col xs={8}>
          <FormGroup
            validationState={
              (fieldsTouched.get(
                `${fieldPrefix}.objectives.${objectiveIdx}.deliverables` +
                  `.${deliverableIdx}.description`
              ) ||
                showAllStepErrors) &&
              fieldsErrors.get(
                `${fieldPrefix}.objectives.${objectiveIdx}.deliverables` +
                  `.${deliverableIdx}.description`
              )
                ? 'error'
                : null
            }
          >
            <FormControl
              type="text"
              placeholder="Deliverable description"
              value={deliverable.description}
              onChange={(ev) =>
                updateDeliverable(itemObjectId, objectiveIdx, deliverableIdx, {
                  description: ev.target.value,
                })
              }
              disabled={deliverable.quarter_type === 'past'}
            />
          </FormGroup>
        </Col>
        <Col xs={2}>
          {deliverable.id && (
            <FormControl
              componentClass="select"
              value={deliverable.status}
              onChange={(ev) =>
                updateDeliverable(itemObjectId, objectiveIdx, deliverableIdx, {
                  status: ev.target.value,
                })
              }
              disabled={
                deliverable.quarter_type === 'past' && deliverable.status !== ''
              }
            >
              <option value="">- Pick Status -</option>
              <Options choices={Object.entries(deliverableStatusChoices)} />
            </FormControl>
          )}
        </Col>
        <Col xs={1}>
          {(mode === 'create' || !objective.id) &&
            !hideRemove && (
              <Button
                onClick={() =>
                  removeDeliverable(itemObjectId, objectiveIdx, deliverableIdx)
                }
              >
                ✖
              </Button>
            )}
        </Col>
      </Row>
    </FormGroup>
  </div>
);
