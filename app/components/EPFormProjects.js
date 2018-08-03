import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row } from 'react-bootstrap';
import { EPFormObjective } from 'components/EPFormObjective';
import { ProjectDeliverable } from 'records/ProjectObjective';
import { EPFormPlanItem } from 'components/EPFormPlanItem';
import ProjectSelector from './ProjectSelector';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

const EPFormProjects = ({
  mode,
  currentQuarter,
  projects,
  selectedProjects,
  engagementPlan,
  fetchProject,
  searchProjects,
  selectProjects,
  removeProject,
  updateProjectItem,
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
          <EPFormPlanItem
            key={projectItem.project_id}
            {...{
              planItem: projectItem,
              title: projectItem.project.title,
              remove: () =>
                selectProjects(selectedProjects.delete(projectItem.project_id)),
              setRemoved: () =>
                updateProjectItem(projectItem.project_id, {
                  removed_at: new Date().toISOString(),
                }),
              unsetRemoved: () =>
                updateProjectItem(projectItem.project_id, { removed_at: null }),
              onReasonRemovedChange: (reason_removed) =>
                updateProjectItem(projectItem.project_id, { reason_removed }),
            }}
          >
            {projectItem.objectives.map((objective, objectiveIdx) => (
              <EPFormObjective
                key={makeKey(objective, objectiveIdx)}
                {...{
                  mode,
                  currentQuarter,
                  itemObjectId: projectItem.project_id,
                  objective,
                  objectiveIdx,
                  updateObjective: updateProjectObjective,
                  removeObjective: removeProjectObjective,
                  addDeliverable: addProjectObjectiveDeliverable,
                  updateDeliverable: updateProjectObjectiveDeliverable,
                  removeDeliverable: removeProjectObjectiveDeliverable,
                  deliverableStatusChoices: ProjectDeliverable.status_choices,
                }}
              />
            ))}
            {(mode === 'create' || !projectItem.id) && (
              <Row className="text-center">
                <Button
                  onClick={() => addProjectObjective(projectItem.project_id)}
                >
                  Add Objective
                </Button>
              </Row>
            )}
          </EPFormPlanItem>
        ))
        .toJS()}
  </div>
);

EPFormProjects.propTypes = {
  mode: PropTypes.string,
  currentQuarter: PropTypes.number,
  projects: PropTypes.object,
  selectedProjects: PropTypes.object,
  projectItems: PropTypes.object,
  fetchProject: PropTypes.func,
  searchProjects: PropTypes.func,
  selectProjects: PropTypes.func,
  removeProject: PropTypes.func,
  updateProjectItem: PropTypes.func,
  // objectives:
  addProjectObjective: PropTypes.func,
  updateProjectObjective: PropTypes.func,
  removeProjectObjective: PropTypes.func,
  addProjectObjectiveDeliverable: PropTypes.func,
  updateProjectObjectiveDeliverable: PropTypes.func,
  removeProjectObjectiveDeliverable: PropTypes.func,
};

export default EPFormProjects;
