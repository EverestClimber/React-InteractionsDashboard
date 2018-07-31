import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Button,
  FormControl,
  FormGroup,
  Panel,
} from 'react-bootstrap';
import { Options } from './forms';

export default class CreateEPAddHCPObjectives extends React.Component {
  static propTypes = {
    engagementPlan: PropTypes.object,
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

  constructor(props) {
    super(props);
    this.state = {
      selectedHCPItemIdx: 0,
    };
  }

  showPrevHCPItem = () =>
    this.setState((prevState) => ({
      selectedHCPItemIdx: prevState.selectedHCPItemIdx
        ? prevState.selectedHCPItemIdx - 1
        : this.props.engagementPlan.hcp_items.size - 1,
    }));

  showNextHCPItem = () =>
    this.setState((prevState) => ({
      selectedHCPItemIdx:
        prevState.selectedHCPItemIdx <
        this.props.engagementPlan.hcp_items.size - 1
          ? prevState.selectedHCPItemIdx + 1
          : 0,
    }));

  render() {
    const {
      bcsfs,
      medicalPlanObjectives,
      projects,
      engagementPlan,
      addHCPObjective,
      updateHCPObjective,
      removeHCPObjective,
      addHCPObjectiveDeliverable,
      updateHCPObjectiveDeliverable,
      removeHCPObjectiveDeliverable,
    } = this.props;

    const hcpItem = engagementPlan.hcp_items.get(this.state.selectedHCPItemIdx);
    const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

    return (
      <div className="CreateEPAddHCPObjectives">
        <h2>Step 2: HCP Objectives</h2>

        {hcpItem && (
          <div
            key={hcpItem.hcp_id}
            className="CreateEPAddHCPObjectives__hcpItem"
          >
            <Panel className="CreateEPAddHCPObjectives__hcpItem__hcp">
              <Panel.Body>
                <Button onClick={this.showPrevHCPItem} className="pull-left">
                  &lt;
                </Button>
                <Button onClick={this.showNextHCPItem} className="pull-right">
                  &gt;
                </Button>
                <p className="text-center">
                  {hcpItem.hcp.first_name} {hcpItem.hcp.last_name}
                </p>
              </Panel.Body>
            </Panel>

            {hcpItem.objectives
              .map((objective, objectiveIdx) => (
                <Row key={makeKey(objective, objectiveIdx)}>
                  <Col xs={10} xsOffset={1}>
                    <Panel className="CreateEPAddHCPObjectives__objectives">
                      <Panel.Heading>
                        <Button
                          className="pull-right"
                          onClick={() =>
                            removeHCPObjective(hcpItem.hcp_id, objectiveIdx)
                          }
                        >
                          ✖
                        </Button>
                        Objective
                      </Panel.Heading>
                      <Panel.Body>
                        <br />
                        <div className="CreateEPAddHCPObjectives__objective">
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
                                      />
                                    </Col>
                                    <Col xs={1}>
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
                                    </Col>
                                  </Row>
                                </FormGroup>
                              </div>
                            ))
                            .toJS()}
                          <Row className="text-center">
                            <Button
                              onClick={() =>
                                addHCPObjectiveDeliverable(
                                  hcpItem.hcp_id,
                                  objectiveIdx
                                )
                              }
                            >
                              Add Deliverable
                            </Button>
                          </Row>
                          <br />
                          <Row>
                            <Col sm={4}>
                              <FormControl
                                componentClass="select"
                                value={hcpItem.medical_plan_id}
                                onChange={(ev) =>
                                  updateHCPObjective(
                                    hcpItem.hcp_id,
                                    objectiveIdx,
                                    {
                                      medical_plan_objective_id: +ev.target
                                        .value,
                                    }
                                  )
                                }
                              >
                                <option value={null}>
                                  - Medical Plan Objective -
                                </option>
                                <Options
                                  choices={Array.from(
                                    medicalPlanObjectives.values()
                                  ).map((it) => [it.id, it.name])}
                                />
                              </FormControl>
                            </Col>
                            <Col sm={4}>
                              <FormControl
                                componentClass="select"
                                value={hcpItem.project_id}
                                onChange={(ev) =>
                                  updateHCPObjective(
                                    hcpItem.hcp_id,
                                    objectiveIdx,
                                    { project_id: +ev.target.value }
                                  )
                                }
                              >
                                <option value={null}>- Project -</option>
                                <Options
                                  choices={Array.from(projects.values()).map(
                                    (it) => [it.id, it.title]
                                  )}
                                />
                              </FormControl>
                            </Col>
                            <Col sm={4}>
                              <FormControl
                                componentClass="select"
                                value={hcpItem.bcsf_id}
                                onChange={(ev) =>
                                  updateHCPObjective(
                                    hcpItem.hcp_id,
                                    objectiveIdx,
                                    { bcsf_id: +ev.target.value }
                                  )
                                }
                              >
                                <option value={null}>
                                  - Critical Success Factor -
                                </option>
                                <Options
                                  choices={Array.from(bcsfs.values()).map(
                                    (it) => [it.id, it.name]
                                  )}
                                />
                              </FormControl>
                            </Col>
                          </Row>
                        </div>
                      </Panel.Body>
                    </Panel>
                  </Col>
                </Row>
              ))
              .toJS()}

            <Row className="text-center">
              <Button onClick={() => addHCPObjective(hcpItem.hcp_id)}>
                Add Objective
              </Button>
            </Row>
          </div>
        )}
      </div>
    );
  }
}
