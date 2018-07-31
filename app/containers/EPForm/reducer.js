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
});

function updateInEPlanForHCP(state, hcpId, pathStr, updateCb) {
  const ePlan = state.get('engagementPlan');
  const hcpItemIdx = ePlan.hcp_items.findIndex((it) => it.hcp_id === hcpId);
  const path = pathStr
    .split('.')
    .map((s) => (s === 'HCP_ITEM_IDX' ? hcpItemIdx : s));
  return state.set('engagementPlan', ePlan.updateIn(path, updateCb));
}

function updateInEPlanForProject(state, projectId, pathStr, updateCb) {
  const ePlan = state.get('engagementPlan');
  const projectItemIdx = ePlan.project_items.findIndex(
    (it) => it.project_id === projectId
  );
  const path = pathStr
    .split('.')
    .map((s) => (s === 'PROJECT_ITEM_IDX' ? projectItemIdx : s));
  return state.set('engagementPlan', ePlan.updateIn(path, updateCb));
}

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case actions.setEPAction.type: {
      const ePlan = EngagementPlan.fromApiData(action.engagementPlan);
      return state.merge({
        engagementPlan: ePlan,
        selectedHCPs: new OrderedMap(
          ePlan.hcp_items.map((it) => [it.hcp_id, it.hcp])
        ),
        selectedProjects: new OrderedMap(
          ePlan.project_items.map((it) => [it.project_id, it.project])
        ),
      });
    }

    case actions.fetchCreateEPRequiredDataActions.success.type:
      return state.merge({
        bcsfs: action.payload.bcsfs,
        medicalPlanObjectives: action.payload.medicalPlanObjectives,
        projects: action.payload.projects,
      });

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
      return state
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
    }

    case actions.removeHCPAction.type:
      return state.merge({
        selectedHCPs: state.get('selectedHCPs').remove(action.hcpId),
      });

    case actions.updateHCPItemAction.type: {
      const { hcpId, data } = action.payload;
      return updateInEPlanForHCP(state, hcpId, 'hcp_items.HCP_ITEM_IDX', (it) =>
        it.merge(data)
      );
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
        (objective) => objective.merge(data)
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
      const { hcpId, objectiveIdx } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        `hcp_items.HCP_ITEM_IDX.objectives.${objectiveIdx}.deliverables`,
        (deliverables) => deliverables.push(HCPDeliverable.fromApiData())
      );
    }

    case actions.updateHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx, deliverableIdx, data } = action.payload;
      return updateInEPlanForHCP(
        state,
        hcpId,
        `hcp_items.HCP_ITEM_IDX.objectives.${objectiveIdx}.deliverables.${deliverableIdx}`,
        (deliverable) => deliverable.merge(data)
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
      const { projectId, objectiveIdx } = action.payload;
      return updateInEPlanForProject(
        state,
        projectId,
        `project_items.PROJECT_ITEM_IDX.objectives.${objectiveIdx}.deliverables`,
        (deliverables) => deliverables.push(ProjectDeliverable.fromApiData())
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
      return state
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
    }

    default:
      return state;
  }
}

export default createEpReducer;
