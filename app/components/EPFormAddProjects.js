import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormGroup,
  Row,
  Col,
  Button,
  Panel,
} from 'react-bootstrap';
import ProjectSelector from './ProjectSelector';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

const EPFormAddProjects = ({
  projects,
  selectedProjects,
  engagementPlan,
  fetchProject,
  searchProjects,
  selectProjects,
  removeProject,
  // objectives:
  addProjectObjective,
  updateProjectObjective,
  removeProjectObjective,
  addProjectObjectiveDeliverable,
  updateProjectObjectiveDeliverable,
  removeProjectObjectiveDeliverable,
}) => (
  <div>
    <h2>Step 2: Add Projects & Objectives</h2>

    <ProjectSelector
      items={projects.toJS()}
      selectedItems={selectedProjects}
      searchItems={searchProjects}
      fetchItem={fetchProject}
      removeItem={removeProject}
      input={{ onChange: selectProjects }}
      multiple
    />

    {!!engagementPlan.project_items.size &&
      engagementPlan.project_items
        .map((projectItem) => (
          <ProjectItem
            key={projectItem.project_id}
            {...{
              projectItem,
              handleRemove: () =>
                selectProjects(selectedProjects.delete(projectItem.project_id)),
              addProjectObjective,
              updateProjectObjective,
              removeProjectObjective,
              addProjectObjectiveDeliverable,
              updateProjectObjectiveDeliverable,
              removeProjectObjectiveDeliverable,
            }}
          />
        ))
        .toJS()}
  </div>
);

EPFormAddProjects.propTypes = {
  projects: PropTypes.object,
  selectedProjects: PropTypes.object,
  projectItems: PropTypes.object,
  fetchProject: PropTypes.func,
  searchProjects: PropTypes.func,
  selectProjects: PropTypes.func,
  removeProject: PropTypes.func,
  // objectives:
  addProjectObjective: PropTypes.func,
  updateProjectObjective: PropTypes.func,
  removeProjectObjective: PropTypes.func,
  addProjectObjectiveDeliverable: PropTypes.func,
  updateProjectObjectiveDeliverable: PropTypes.func,
  removeProjectObjectiveDeliverable: PropTypes.func,
};

export default EPFormAddProjects;

const ProjectItem = ({
  projectItem,
  handleRemove,
  addProjectObjective,
  updateProjectObjective,
  removeProjectObjective,
  addProjectObjectiveDeliverable,
  updateProjectObjectiveDeliverable,
  removeProjectObjectiveDeliverable,
}) => (
  <Panel className="SelectedProject">
    <Panel.Heading>
      <Button className="pull-right" onClick={handleRemove}>
        ✖
      </Button>
      <p>{projectItem.project.title}</p>
    </Panel.Heading>
    <Panel.Body>
      <br />
      {projectItem.objectives.map((objective, objectiveIdx) => (
        <ProjectObjective
          key={makeKey(objective, objectiveIdx)}
          {...{
            projectItem,
            objective,
            objectiveIdx,
            updateProjectObjective,
            removeProjectObjective,
            addProjectObjectiveDeliverable,
            updateProjectObjectiveDeliverable,
            removeProjectObjectiveDeliverable,
          }}
        />
      ))}
      <Row className="text-center">
        <Button onClick={() => addProjectObjective(projectItem.project_id)}>
          Add Objective
        </Button>
      </Row>
    </Panel.Body>
  </Panel>
);

const ProjectObjective = ({
  projectItem,
  objective,
  objectiveIdx,
  updateProjectObjective,
  removeProjectObjective,
  addProjectObjectiveDeliverable,
  updateProjectObjectiveDeliverable,
  removeProjectObjectiveDeliverable,
}) => (
  <Row key={makeKey(objective, objectiveIdx)}>
    <Col xs={10} xsOffset={1}>
      <Panel className="CreateEPAddProjectObjectives__objectives">
        <Panel.Heading>
          <Button
            className="pull-right"
            onClick={() =>
              removeProjectObjective(projectItem.project_id, objectiveIdx)
            }
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
              onChange={(ev) =>
                updateProjectObjective(projectItem.project_id, objectiveIdx, {
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
                  className="CreateEPAddProjectObjectives__deliverable"
                >
                  <FormGroup>
                    <Row>
                      <Col xs={1}>
                        <FormControl
                          type="text"
                          placeholder="Q#"
                          value={deliverable.quarter}
                          onChange={(ev) =>
                            updateProjectObjectiveDeliverable(
                              projectItem.project_id,
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
                            updateProjectObjectiveDeliverable(
                              projectItem.project_id,
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
                            removeProjectObjectiveDeliverable(
                              projectItem.project_id,
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
                  addProjectObjectiveDeliverable(
                    projectItem.project_id,
                    objectiveIdx
                  )
                }
              >
                Add Deliverable
              </Button>
            </Row>
          </div>
        </Panel.Body>
      </Panel>
    </Col>
  </Row>
);
