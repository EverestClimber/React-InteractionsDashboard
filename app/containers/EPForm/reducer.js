import { fromJS, List, OrderedMap } from 'immutable';
import {
  EngagementPlan,
  EngagementPlanHCPItem,
  EngagementPlanProjectItem,
} from 'records/EngagementPlan';
import { HCPObjective, HCPDeliverable } from 'records/HCPObjective';
import { ProjectObjective, ProjectDeliverable } from 'records/ProjectObjective';
import * as actions from './actions';

const initialState = fromJS({
  serverError: '',
  engagementPlan: new EngagementPlan(),
  // add HCPs
  // hcp: null,
  hcps: new List(),
  selectedHCPs: new OrderedMap(),
  // add HCP Objectives
  bcsfs: new List(),
  medicalPlanObjectives: new List(),
  projects: new List(),
  // add Projects
  // project: null,
  searchedProjects: new List(),
  selectedProjects: new OrderedMap(),
  // Validation:
  stepsErrors: { 0: [], 1: [] },
  stepsPristine: { 0: true, 1: true },
  fieldsErrors: { 0: {}, 1: {} },
  fieldsTouched: { 0: {}, 1: {} },
});

function validateSteps(state, keepPristine = false) {
  const stepsErrors = { 0: [], 1: [] };
  const stepsPristine = { 0: true, 1: true };

  const hcpItems = state.getIn(['engagementPlan', 'hcp_items']);
  if (hcpItems.size < 1) {
    stepsErrors[0].push('At least one HCP must be added to the plan');
    if (!keepPristine) {
      stepsPristine[0] = false;
    }
  }

  return state.merge({
    stepsErrors: fromJS(stepsErrors),
    stepsPristine: fromJS(stepsPristine),
  });
}

function validateFields(state) {
  const fieldsErrors = { 0: {}, 1: {} };

  const hcpItems = state.getIn(['engagementPlan', 'hcp_items']);
  for (const [hcpItemIdx, hcpItem] of hcpItems.entries()) {
    if (!hcpItem.reason) {
      fieldsErrors[0][`hcp_items.${hcpItemIdx}.reason`] = [
        'A reason must be specified for adding HCP to the plan',
      ];
    }
    if (hcpItem.reason === 'other' && !hcpItem.reason_other) {
      fieldsErrors[0][`hcp_items.${hcpItemIdx}.reason_other`] = [
        'A reason must be specified for adding HCP to the plan',
      ];
    }
    for (const [objectiveIdx, objective] of hcpItem.objectives.entries()) {
      if (!objective.description) {
        fieldsErrors[0][
          `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.description`
        ] = ['A description is required for HCP objective'];
      }
      if (!objective.medical_plan_objective_id) {
        fieldsErrors[0][
          `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.medical_plan_objective_id`
        ] = ['A medical plan objective is required for HCP objective'];
      }
      if (!objective.bcsf_id) {
        fieldsErrors[0][
          `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.bcsf_id`
        ] = ['A brand critical success factor is required for HCP objective'];
      }
      if (!objective.project_id) {
        fieldsErrors[0][
          `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}.project_id`
        ] = ['A project is required for HCP objective'];
      }
      for (const [
        deliverableIdx,
        deliverable,
      ] of objective.deliverables.entries()) {
        if (!deliverable.description) {
          fieldsErrors[0][
            `hcp_items.${hcpItemIdx}.objectives.${objectiveIdx}` +
              `.deliverables.${deliverableIdx}.description`
          ] = ['A description is required for HCP deliverable'];
        }
      }
    }
  }

  const projectItems = state.getIn(['engagementPlan', 'project_items']);
  for (const [projectItemIdx, projectItem] of projectItems.entries()) {
    for (const [objectiveIdx, objective] of projectItem.objectives.entries()) {
      if (!objective.description) {
        fieldsErrors[1][
          `project_items.${projectItemIdx}.objectives.${objectiveIdx}.description`
        ] = ['A description is required for Project objective'];
      }
      for (const [
        deliverableIdx,
        deliverable,
      ] of objective.deliverables.entries()) {
        if (!deliverable.description) {
          fieldsErrors[1][
            `project_items.${projectItemIdx}.objectives.${objectiveIdx}` +
              `.deliverables.${deliverableIdx}.description`
          ] = ['A description is required for Project deliverable'];
        }
      }
    }
  }

  return state.set('fieldsErrors', fromJS(fieldsErrors));
}

function updateInEPlanForHCP(state, hcpId, pathStr, update) {
  const ePlan = state.get('engagementPlan');
  const hcpItemIdx = ePlan.hcp_items.findIndex((it) => it.hcp_id === hcpId);
  const path = pathStr
    .split('.')
    .map((s) => (s === 'HCP_ITEM_IDX' ? hcpItemIdx : s));
  let newState = state;

  // either A. update with a function
  if (typeof update === 'function') {
    newState = newState
      .set('engagementPlan', ePlan.updateIn(path, update))
      .setIn(['fieldsTouched', '0', path.join('.')], true);
  } else {
    // ...or B. update with a dict
    for (const field of Object.keys(update)) {
      newState = newState.setIn(
        ['fieldsTouched', '0', [...path, field].join('.')],
        true
      );
    }
    newState = newState
      .set(
        'engagementPlan',
        ePlan.updateIn(path, (fields) => fields.merge(update))
      )
      .setIn(['fieldsTouched', '0', path.join('.')], true);
  }

  return validateFields(newState);
}

function updateInEPlanForProject(state, projectId, pathStr, update) {
  const ePlan = state.get('engagementPlan');
  const projectItemIdx = ePlan.project_items.findIndex(
    (it) => it.project_id === projectId
  );
  const path = pathStr
    .split('.')
    .map((s) => (s === 'PROJECT_ITEM_IDX' ? projectItemIdx : s));
  let newState = state;

  // either A. update with a function
  if (typeof update === 'function') {
    newState = newState
      .set('engagementPlan', ePlan.updateIn(path, update))
      .setIn(['fieldsTouched', '1', path.join('.')], true);
  } else {
    // ...or B. update with a dict
    for (const field of Object.keys(update)) {
      newState = newState.setIn(
        ['fieldsTouched', '1', [...path, field].join('.')],
        true
      );
    }
    newState = newState
      .set(
        'engagementPlan',
        ePlan.updateIn(path, (fields) => fields.merge(update))
      )
      .setIn(['fieldsTouched', '1', path.join('.')], true);
  }

  return validateFields(newState);
}

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case actions.setEPAction.type: {
      const ePlan = EngagementPlan.fromApiData(action.engagementPlan);
      return validateSteps(
        state.merge({
          engagementPlan: ePlan,
          selectedHCPs: new OrderedMap(
            ePlan.hcp_items.map((it) => [it.hcp_id, it.hcp])
          ),
          selectedProjects: new OrderedMap(
            ePlan.project_items.map((it) => [it.project_id, it.project])
          ),
        }),
        true
      );
    }

    case actions.fetchCreateEPRequiredDataActions.success.type:
      return validateSteps(
        state.merge({
          bcsfs: action.payload.bcsfs,
          medicalPlanObjectives: action.payload.medicalPlanObjectives,
          projects: action.payload.projects,
        }),
        true
      );

    case actions.searchHCPsActions.success.type:
      return state.merge({ hcps: action.hcps });

    case actions.fetchHCPActions.success.type:
      return state.merge({ hcp: action.hcp });

    case actions.selectHCPsAction.type: {
      const selectedHCPs = action.hcps;

      // newly selected HCPs for which hcp_items need to be created
      const newlySelectedHCPs = selectedHCPs.filter(
        (hcp) =>
          !state
            .get('engagementPlan')
            .hcp_items.find((it) => it.hcp_id === hcp.id)
      );

      const newState = state
        .set('selectedHCPs', selectedHCPs)
        .updateIn(['engagementPlan', 'hcp_items'], (hcpItems) =>
          hcpItems
            // only keep items for currently selected HCPs
            .filter((it) => selectedHCPs.get(it.hcp_id))
            // add items for newly selected HCPs
            .concat(
              new List(
                newlySelectedHCPs
                  .map((hcp) =>
                    EngagementPlanHCPItem.fromApiData({ hcp, hcp_id: hcp.id })
                  )
                  .values()
              )
            )
        );

      return validateSteps(validateFields(newState));
    }

    // case actions.removeHCPAction.type:
    //   return state
    //     .set('selectedHCPs', state.get('selectedHCPs').remove(action.hcpId))
    //     .updateIn(['engagementPlan', 'hcp_items'], (hcpItems) =>
    //       hcpItems.filter((it) => it.hcp_id !== action.hcpId)
    //     );

    case actions.updateHCPItemAction.type: {
      const { hcpId, data } = action.payload;
      return updateInEPlanForHCP(state, hcpId, 'hcp_items.HCP_ITEM_IDX', data);
    }

    case actions.addHCPObjectiveAction.type: {
      return updateInEPlanForHCP(
        state,
        action.hcpId,
        'hcp_items.HCP_ITEM_IDX.objectives',
        (objectives) =>
          objectives.push(
            HCPObjective.fromApiData({
              hcp_id: action.hcpId,
            })
          )
      );
    }

    case actions.updateHCPObjectiveAction.type: {
      const { hcpId, idx, data } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        `hcp_items.HCP_ITEM_IDX.objectives.${idx}`,
        data
      );
    }

    case actions.removeHCPObjectiveAction.type: {
      const { hcpId, idx } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        'hcp_items.HCP_ITEM_IDX.objectives',
        (objectives) => objectives.delete(idx)
      );
    }

    case actions.addHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx, quarter } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        `hcp_items.HCP_ITEM_IDX.objectives.${objectiveIdx}.deliverables`,
        (deliverables) =>
          deliverables.push(HCPDeliverable.fromApiData({ quarter }))
      );
    }

    case actions.updateHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx, deliverableIdx, data } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        `hcp_items.HCP_ITEM_IDX.objectives.${objectiveIdx}.deliverables.${deliverableIdx}`,
        data
      );
    }

    case actions.removeHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx, deliverableIdx } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        `hcp_items.HCP_ITEM_IDX.objectives.${objectiveIdx}.deliverables`,
        (deliverables) => deliverables.delete(deliverableIdx)
      );
    }

    case actions.updateProjectItemAction.type: {
      const { projectId, data } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        'project_items.PROJECT_ITEM_IDX',
        (it) => it.merge(data)
      );
    }

    case actions.addProjectObjectiveAction.type: {
      return updateInEPlanForProject(
        state,
        action.projectId,
        'project_items.PROJECT_ITEM_IDX.objectives',
        (objectives) =>
          objectives.push(
            ProjectObjective.fromApiData({
              project_id: action.projectId,
            })
          )
      );
    }

    case actions.updateProjectObjectiveAction.type: {
      const { projectId, idx, data } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        `project_items.PROJECT_ITEM_IDX.objectives.${idx}`,
        (objective) => objective.merge(data)
      );
    }

    case actions.removeProjectObjectiveAction.type: {
      const { projectId, idx } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        'project_items.PROJECT_ITEM_IDX.objectives',
        (objectives) => objectives.delete(idx)
      );
    }

    case actions.addProjectObjectiveDeliverableAction.type: {
      const { projectId, objectiveIdx, quarter } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        `project_items.PROJECT_ITEM_IDX.objectives.${objectiveIdx}.deliverables`,
        (deliverables) =>
          deliverables.push(ProjectDeliverable.fromApiData({ quarter }))
      );
    }

    case actions.updateProjectObjectiveDeliverableAction.type: {
      const { projectId, objectiveIdx, deliverableIdx, data } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        `project_items.PROJECT_ITEM_IDX.objectives.${objectiveIdx}.deliverables.${deliverableIdx}`,
        (deliverable) => deliverable.merge(data)
      );
    }

    case actions.removeProjectObjectiveDeliverableAction.type: {
      const { projectId, objectiveIdx, deliverableIdx } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        `project_items.PROJECT_ITEM_IDX.objectives.${objectiveIdx}.deliverables`,
        (deliverables) => deliverables.delete(deliverableIdx)
      );
    }

    case actions.searchProjectsActions.success.type:
      return state.merge({ searchedProjects: action.projects });

    case actions.selectProjectsAction.type: {
      const selectedProjects = action.projects;

      // newly selected Projects for which project_items need to be created
      const newlySelectedProjects = selectedProjects.filter(
        (project) =>
          !state
            .get('engagementPlan')
            .project_items.find((it) => it.project_id === project.id)
      );

      const newState = state
        .set('selectedProjects', selectedProjects)
        .updateIn(['engagementPlan', 'project_items'], (projectItems) =>
          projectItems
            // only keep items for currently selected HCPs
            .filter((it) => selectedProjects.get(it.project_id))
            // add items for newly selected Projects
            .concat(
              new List(
                newlySelectedProjects
                  .map((project) =>
                    EngagementPlanProjectItem.fromApiData({
                      project,
                      project_id: project.id,
                    })
                  )
                  .values()
              )
            )
        );

      return validateSteps(validateFields(newState));
    }

    default:
      return state;
  }
}

export default createEpReducer;
