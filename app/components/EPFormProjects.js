import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Row } from 'react-bootstrap';
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
  // validation
  fieldsErrors,
  fieldsTouched,
  showAllStepErrors,
}) => (
  <div className="EPFormProjects EPForm__step">
    <ProjectSelector
      items={projects.valueSeq().toJS()}
      selectedItems={selectedProjects}
      searchItems={searchProjects}
      fetchItem={fetchProject}
      removeItem={removeProject}
      input={{ onChange: selectProjects }}
      multiple
    />

    <h2 className="EPForm__step__title">
      My Projects <Badge>{engagementPlan.project_items.size}</Badge>
    </h2>

    {!!engagementPlan.project_items.size &&
      engagementPlan.project_items
        .map((projectItem, projectItemIdx) => (
          <EPProjectItem
            key={projectItem.project_id}
            {...{
              mode,
              currentQuarter,
              projectItem,
              projectItemIdx,
              // medicalPlanObjectives,
              // bcsfs,
              // for create/edit mode:
              updateProjectItem,
              selectProjects,
              selectedProjects,
              fieldsTouched,
              fieldsErrors,
              showAllStepErrors,
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
  // validation
  fieldsErrors: PropTypes.object,
  fieldsTouched: PropTypes.object,
  showAllStepErrors: PropTypes.bool,
};

export default EPFormProjects;

export const EPProjectItem = ({
  mode,
  currentQuarter,
  projectItem,
  projectItemIdx,
  // medicalPlanObjectives,
  // bcsfs,
  // for create/edit mode:
  updateProjectItem,
  selectProjects,
  selectedProjects,
  fieldsTouched,
  fieldsErrors,
  showAllStepErrors,
  addProjectObjective,
  updateProjectObjective,
  removeProjectObjective,
  addProjectObjectiveDeliverable,
  updateProjectObjectiveDeliverable,
  removeProjectObjectiveDeliverable,
}) => (
  <EPFormPlanItem
    {...{
      mode,
      className: 'EPForm__ProjectItem',
      planItem: projectItem,
      title: (
        <div className="EPForm__ProjectItem__title">
          {projectItem.project.title}
          <Badge className="objscount">
            {projectItem.objectives.size} OBJECTIVES
          </Badge>
          <div className="affiliateGroups">
            {projectItem.project.affiliate_group_names.map((name) => (
              <Badge key={name}>{name.toUpperCase()}</Badge>
            ))}
          </div>
        </div>
      ),
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
          hideRemove: projectItem.objectives.size <= 1,
          currentQuarter,
          itemObjectId: projectItem.project_id,
          fieldPrefix: `project_items.${projectItemIdx}`,
          objective,
          objectiveIdx,
          deliverableStatusChoices: ProjectDeliverable.status_choices,
          fieldsTouched,
          // for create/edit mode:
          fieldsErrors,
          showAllStepErrors,
          updateObjective: updateProjectObjective,
          removeObjective: removeProjectObjective,
          addDeliverable: addProjectObjectiveDeliverable,
          updateDeliverable: updateProjectObjectiveDeliverable,
          removeDeliverable: removeProjectObjectiveDeliverable,
        }}
      />
    ))}
    {(mode === 'create' || !projectItem.id) && (
      <Row className="text-center">
        <Button onClick={() => addProjectObjective(projectItem.project_id)}>
          Add Objective
        </Button>
      </Row>
    )}
  </EPFormPlanItem>
);
