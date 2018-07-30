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


export default class CreateEPAddProjectObjectives extends React.Component {
  static propTypes = {
    projectItems: PropTypes.object,
    addProjectObjective: PropTypes.func,
    updateProjectObjective: PropTypes.func,
    removeProjectObjective: PropTypes.func,
    addDeliverable: PropTypes.func,
    updateDeliverable: PropTypes.func,
    removeDeliverable: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedProjectItemIdx: 0,
    };
  }

  showPrevProjectItem = () => this.setState((prevState) => ({
    selectedProjectItemIdx: prevState.selectedProjectItemIdx
      ? prevState.selectedProjectItemIdx - 1
      : this.props.projectItems.size - 1,
  }));

  showNextProjectItem = () => this.setState((prevState) => ({
    selectedProjectItemIdx: prevState.selectedProjectItemIdx < this.props.projectItems.size - 1
      ? prevState.selectedProjectItemIdx + 1
      : 0,
  }));

  render() {
    const {
      projectItems,
      addProjectObjective,
      updateProjectObjective,
      removeProjectObjective,
      addDeliverable,
      updateDeliverable,
      removeDeliverable,
    } = this.props;

    const projectItem = projectItems.get(this.state.selectedProjectItemIdx);
    const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

    return (
      <div className="CreateEPAddProjectObjectives">
        <h2>Step 4: Project Objectives</h2>

        {projectItem && (

          <div key={projectItem.project_id} className="CreateEPAddProjectObjectives__projectItem">

            <Panel className="CreateEPAddProjectObjectives__projectItem__project">
              <Panel.Body>
                <Button onClick={this.showPrevProjectItem} className="pull-left">&lt;</Button>
                <Button onClick={this.showNextProjectItem} className="pull-right">&gt;</Button>
                <p className="text-center">{projectItem.project.title}</p>
              </Panel.Body>
            </Panel>

            {projectItem.objectives.map((objective, objectiveIdx) => (
              <Row key={makeKey(objective, objectiveIdx)}>
                <Col xs={10} xsOffset={1}>
                  <Panel className="CreateEPAddProjectObjectives__objectives">
                    <Panel.Heading>
                      <Button
                        className="pull-right"
                        onClick={() => removeProjectObjective(projectItem.project_id, objectiveIdx)}
                      >
                        ✖
                      </Button>
                      Objective
                    </Panel.Heading>
                    <Panel.Body>
                      <br />
                      <div className="CreateEPAddProjectObjectives__objective">
                        <FormControl
                          componentClass="textarea"
                          placeholder="Objective Description"
                          value={objective.description}
                          onChange={(ev) => updateProjectObjective(
                            projectItem.project_id,
                            objectiveIdx,
                            { description: ev.target.value }
                          )}
                        />
                        <br />
                        <h5><strong>Deliverables</strong></h5>
                        {objective.deliverables.map((deliverable, deliverableIdx) => (
                          <div
                            key={makeKey(deliverable, deliverableIdx)}
                            className="CreateEPAddProjectObjectives__deliverable"
                          >
                            <FormGroup>
                              <Row>
                                <Col xs={1}>
                                  <FormControl
                                    type="text"
                                    placeholder="Q#"
                                    value={deliverable.quarter}
                                    onChange={(ev) => updateDeliverable(
                                      projectItem.project_id,
                                      objectiveIdx,
                                      deliverableIdx,
                                      { quarter: +ev.target.value }
                                    )}
                                  />
                                </Col>
                                <Col xs={10}>
                                  <FormControl
                                    type="text"
                                    placeholder="Deliverable description"
                                    value={deliverable.description}
                                    onChange={(ev) => updateDeliverable(
                                      projectItem.project_id,
                                      objectiveIdx,
                                      deliverableIdx,
                                      { description: ev.target.value }
                                    )}
                                  />
                                </Col>
                                <Col xs={1}>
                                  <Button
                                    onClick={() => removeDeliverable(
                                      projectItem.project_id, objectiveIdx, deliverableIdx
                                    )}
                                  >
                                    ✖
                                  </Button>
                                </Col>
                              </Row>
                            </FormGroup>
                          </div>
                        )).toJS()}
                        <Row className="text-center">
                          <Button onClick={() => addDeliverable(projectItem.project_id, objectiveIdx)}>
                            Add Deliverable
                          </Button>
                        </Row>
                      </div>
                    </Panel.Body>
                  </Panel>
                </Col>
              </Row>
            )).toJS()}

            <Row className="text-center">
              <Button onClick={() => addProjectObjective(projectItem.project_id)}>
                Add Objective
              </Button>
            </Row>

          </div>

        )}
      </div>
    );
  }
}
