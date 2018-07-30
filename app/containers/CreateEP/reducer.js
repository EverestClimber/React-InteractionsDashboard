import { fromJS, List, OrderedMap } from 'immutable';
import {
  EngagementPlan,
  EngagementPlanHCPItem,
  EngagementPlanProjectItem,
} from 'records/EngagementPlan';
import { HCPObjective, HCPDeliverable } from 'records/HCPObjective';
import {
  removeHCPAction,
  selectHCPsAction,
  updateHCPItemAction,
  addHCPObjectiveAction,
  updateHCPObjectiveAction,
  removeHCPObjectiveAction,
  addHCPObjectiveDeliverableAction,
  updateHCPObjectiveDeliverableAction,
  removeHCPObjectiveDeliverableAction,
  fetchCreateEPRequiredDataActions,
  searchHCPsActions,
  fetchHCPActions,
  searchProjectsActions,
  selectProjectsAction,
} from './actions';


const initialState = fromJS({
  serverError: '',
  engagementPlan: new EngagementPlan(),
  // add HCPs
  hcp: null,
  hcps: new List(),
  selectedHCPs: new OrderedMap(),
  // add HCP Objectives
  bcsfs: new List(),
  medicalPlanObjectives: new List(),
  projects: new List(),
  // add Projects
  project: null,
  searchedProjects: new List(),
  selectedProjects: new OrderedMap(),
});

function updateInEPlanForHCP(state, hcpId, pathStr, updateCb) {
  const ePlan = state.get('engagementPlan');
  const hcpItemIdx = ePlan.hcp_items.findIndex(
    (it) => it.hcp_id === hcpId
  );
  const path = pathStr.split('.').map(
    (s) => s === 'HCP_ITEM_IDX' ? hcpItemIdx : s
  );
  return state.set('engagementPlan', ePlan.updateIn(path, updateCb));
}

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case fetchCreateEPRequiredDataActions.success.type:
      return state.merge({
        bcsfs: action.payload.bcsfs,
        medicalPlanObjectives: action.payload.medicalPlanObjectives,
        projects: action.payload.projects,
      });

    case searchHCPsActions.success.type:
      return state.merge({ hcps: action.hcps });

    case fetchHCPActions.success.type:
      return state.merge({ hcp: action.hcp });

    case selectHCPsAction.type: {
      const selectedHCPs = action.hcps;

      // newly selected HCPs for which hcp_items need to be created
      const newlySelectedHCPs = selectedHCPs.filter(
        (hcp) => !state.get('engagementPlan').hcp_items.find(
          (it) => it.hcp_id === hcp.id
        )
      );
      return state.set('selectedHCPs', selectedHCPs).updateIn(
        ['engagementPlan', 'hcp_items'],
        (hcpItems) => hcpItems
        // only keep items for currently selected HCPs
        .filter((it) => selectedHCPs.get(it.hcp_id))
        // add items for newly selected HCPs
        .concat(new List(newlySelectedHCPs.map(
          (hcp) => EngagementPlanHCPItem.fromApiData({ hcp, hcp_id: hcp.id })
        ).values()))
      );
    }

    case removeHCPAction.type:
      return state.merge({
        selectedHCPs: state.get('selectedHCPs').remove(action.hcpId),
      });

    case updateHCPItemAction.type: {
      const { hcpId, data } = action.payload;
      return updateInEPlanForHCP(
        state, hcpId, 'hcp_items.HCP_ITEM_IDX', (it) => it.merge(data));
    }

    case addHCPObjectiveAction.type: {
      return updateInEPlanForHCP(
        state,
        action.hcpId,
        'hcp_items.HCP_ITEM_IDX.objectives',
        (objectives) => objectives.push(HCPObjective.fromApiData())
      );
    }

    case updateHCPObjectiveAction.type: {
      const { hcpId, idx, data } = action.payload;
      const ePlan = state.get('engagementPlan');
      const hcpItemIdx = ePlan.hcp_items.findIndex(
        (it) => it.hcp_id === hcpId
      );
      return state.set('engagementPlan', ePlan.updateIn(
        ['hcp_items', hcpItemIdx, 'objectives', idx],
        (objective) => objective.merge(data)
      ));
    }

    case removeHCPObjectiveAction.type: {
      const { hcpId, idx } = action.payload;
      const ePlan = state.get('engagementPlan');
      const hcpItemIdx = ePlan.hcp_items.findIndex(
        (it) => it.hcp_id === hcpId
      );
      return state.set('engagementPlan', ePlan.updateIn(
        ['hcp_items', hcpItemIdx, 'objectives'],
        (objectives) => objectives.delete(idx)
      ));
    }

    case addHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx } = action.payload;
      const ePlan = state.get('engagementPlan');
      const hcpItemIdx = ePlan.hcp_items.findIndex(
        (it) => it.hcp_id === hcpId
      );
      return state.set('engagementPlan', ePlan.updateIn(
        ['hcp_items', hcpItemIdx, 'objectives', objectiveIdx, 'deliverables'],
        (deliverables) => deliverables.push(HCPDeliverable.fromApiData())
      ));
    }

    case updateHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx, deliverableIdx, data } = action.payload;
      const ePlan = state.get('engagementPlan');
      const hcpItemIdx = ePlan.hcp_items.findIndex(
        (it) => it.hcp_id === hcpId
      );
      return state.set('engagementPlan', ePlan.updateIn(
        ['hcp_items', hcpItemIdx, 'objectives', objectiveIdx, 'deliverables', deliverableIdx],
        (deliverable) => deliverable.merge(data)
      ));
    }

    case removeHCPObjectiveDeliverableAction.type: {
      const { hcpId, objectiveIdx, deliverableIdx } = action.payload;
      const ePlan = state.get('engagementPlan');
      const hcpItemIdx = ePlan.hcp_items.findIndex(
        (it) => it.hcp_id === hcpId
      );
      return state.set('engagementPlan', ePlan.updateIn(
        ['hcp_items', hcpItemIdx, 'objectives', objectiveIdx, 'deliverables'],
        (deliverables) => deliverables.delete(deliverableIdx)
      ));
    }

    case searchProjectsActions.success.type:
      return state.merge({ searchedProjects: action.projects });

    case selectProjectsAction.type: {
      const selectedProjects = action.projects;

      // newly selected Projects for which project_items need to be created
      const newlySelectedProjects = selectedProjects.filter(
        (project) => !state.get('engagementPlan').project_items.find(
          (it) => it.project_id === project.id
        )
      );
      return state.set('selectedProjects', selectedProjects).updateIn(
        ['engagementPlan', 'project_items'],
        (projectItems) => projectItems
        // only keep items for currently selected HCPs
        .filter((it) => selectedProjects.get(it.project_id))
        // add items for newly selected Projects
        .concat(new List(newlySelectedProjects.map(
          (project) => EngagementPlanProjectItem.fromApiData({ project, project_id: project.id })
        ).values()))
      );
    }

    default:
      return state;
  }
}

export default createEpReducer;
