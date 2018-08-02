import React from 'react';
import PropTypes from 'prop-types';
import { Row, Button, Panel } from 'react-bootstrap';
import { ProjectDeliverable } from 'records/ProjectObjective';
import { EPFormObjective } from 'components/EPFormObjective';
import ProjectSelector from './ProjectSelector';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

const EPFormAddProjects = ({
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
          <ProjectItem
            key={projectItem.project_id}
            {...{
              mode,
              currentQuarter,
              projectItem,
              handleRemove: () =>
                mode === 'create' || !projectItem.id
                  ? selectProjects(
                      selectedProjects.delete(projectItem.project_id)
                    )
                  : updateProjectItem(projectItem.project_id, {
                    removed_at: projectItem.removed_at
                        ? null
                        : new Date().toISOString(),
                  }),
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

export default EPFormAddProjects;

const ProjectItem = ({
  mode,
  currentQuarter,
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
        {projectItem.removed_at ? '✔' : '✖'}
      </Button>
      <p
        style={
          projectItem.removed_at && {
            textDecoration: 'line-through',
            color: 'red',
          }
        }
      >
        {projectItem.project.title}
      </p>
    </Panel.Heading>
    <Panel.Body>
      <br />
      {projectItem.objectives.map((objective, objectiveIdx) => (
        // <ProjectObjective
        //   key={makeKey(objective, objectiveIdx)}
        //   {...{
        //     mode,
        //     currentQuarter,
        //     projectItem,
        //     objective,
        //     objectiveIdx,
        //     updateProjectObjective,
        //     removeProjectObjective,
        //     addProjectObjectiveDeliverable,
        //     updateProjectObjectiveDeliverable,
        //     removeProjectObjectiveDeliverable,
        //   }}
        // />
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
        >
          {/* ...children: mpo, project, csf.... */}
        </EPFormObjective>
      ))}
      {(mode === 'create' || !projectItem.id) && (
        <Row className="text-center">
          <Button onClick={() => addProjectObjective(projectItem.project_id)}>
            Add Objective
          </Button>
        </Row>
      )}
    </Panel.Body>
  </Panel>
);

// const ProjectObjective = ({
//   mode,
//   currentQuarter,
//   projectItem,
//   objective,
//   objectiveIdx,
//   updateProjectObjective,
//   removeProjectObjective,
//   addProjectObjectiveDeliverable,
//   updateProjectObjectiveDeliverable,
//   removeProjectObjectiveDeliverable,
// }) => (
//   <Row key={makeKey(objective, objectiveIdx)}>
//     <Col xs={10} xsOffset={1}>
//       <Panel className="CreateEPAddProjectObjectives__objectives">
//         <Panel.Heading>
//           {(mode === 'create' || !objective.id) && (
//             <Button
//               className="pull-right"
//               onClick={() =>
//                 removeProjectObjective(projectItem.project_id, objectiveIdx)
//               }
//             >
//               ✖
//             </Button>
//           )}
//           Objective
//         </Panel.Heading>
//         <Panel.Body>
//           <br />
//           <div className="CreateEPAddProjectObjectives__objective">
//             <FormControl
//               componentClass="textarea"
//               placeholder="Objective Description"
//               value={objective.description}
//               onChange={(ev) =>
//                 updateProjectObjective(projectItem.project_id, objectiveIdx, {
//                   description: ev.target.value,
//                 })
//               }
//             />
//             <br />
//             <h5>
//               <strong>Deliverables</strong>
//             </h5>
//             {objective.deliverables
//               .map((deliverable, deliverableIdx) => (
//                 <div
//                   key={makeKey(deliverable, deliverableIdx)}
//                   className="CreateEPAddProjectObjectives__deliverable"
//                 >
//                   <FormGroup>
//                     <Row>
//                       <Col xs={1}>
//                         <FormControl
//                           componentClass="select"
//                           value={deliverable.quarter}
//                           onChange={(ev) =>
//                             updateProjectObjectiveDeliverable(
//                               projectItem.project_id,
//                               objectiveIdx,
//                               deliverableIdx,
//                               { quarter: +ev.target.value }
//                             )
//                           }
//                           disabled={mode === 'update' && objective.id}
//                         >
//                           <option value={1} disabled={currentQuarter > 1}>
//                             1
//                           </option>
//                           <option value={2} disabled={currentQuarter > 2}>
//                             2
//                           </option>
//                           <option value={3} disabled={currentQuarter > 3}>
//                             3
//                           </option>
//                           <option value={4}>4</option>
//                         </FormControl>
//                       </Col>
//                       <Col xs={8}>
//                         <FormControl
//                           type="text"
//                           placeholder="Deliverable description"
//                           value={deliverable.description}
//                           onChange={(ev) =>
//                             updateProjectObjectiveDeliverable(
//                               projectItem.project_id,
//                               objectiveIdx,
//                               deliverableIdx,
//                               { description: ev.target.value }
//                             )
//                           }
//                           disabled={deliverable.quarter_type === 'past'}
//                         />
//                       </Col>
//                       <Col xs={2}>
//                         <FormControl
//                           componentClass="select"
//                           value={deliverable.status}
//                           onChange={(ev) =>
//                             updateProjectObjectiveDeliverable(
//                               projectItem.project_id,
//                               objectiveIdx,
//                               deliverableIdx,
//                               { status: ev.target.value }
//                             )
//                           }
//                           disabled={deliverable.quarter_type === 'past'}
//                         >
//                           <option value="">- Pick Status -</option>
//                           <Options
//                             choices={Object.entries(
//                               ProjectDeliverable.status_choices
//                             )}
//                           />
//                         </FormControl>
//                       </Col>
//                       <Col xs={1}>
//                         {(mode === 'create' || !objective.id) && (
//                           <Button
//                             onClick={() =>
//                               removeProjectObjectiveDeliverable(
//                                 projectItem.project_id,
//                                 objectiveIdx,
//                                 deliverableIdx
//                               )
//                             }
//                           >
//                             ✖
//                           </Button>
//                         )}
//                       </Col>
//                     </Row>
//                   </FormGroup>
//                 </div>
//               ))
//               .toJS()}
//             {(mode === 'create' || !objective.id) && (
//               <Row className="text-center">
//                 <Button
//                   onClick={() =>
//                     addProjectObjectiveDeliverable(
//                       projectItem.project_id,
//                       objectiveIdx
//                     )
//                   }
//                 >
//                   Add Deliverable
//                 </Button>
//               </Row>
//             )}
//           </div>
//         </Panel.Body>
//       </Panel>
//     </Col>
//   </Row>
// );
