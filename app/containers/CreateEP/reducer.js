import { fromJS, List, OrderedMap } from 'immutable';
import {
  EngagementPlan,
  EngagementPlanHCPItem,
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
} from './actions';


const initialState = fromJS({
  serverError: '',
  engagementPlan: new EngagementPlan(),
  bcsfs: new List(),
  medicalPlanObjectives: new List(),
  projects: new List(),
  selectedHCPs: new OrderedMap(),
});

function updateInEPlanForHCP(state, hcpId, pathStr, updateCb) {
  const ePlan = state.get('engagementPlan');
  const hcpItemIdx = ePlan.hcp_items.findIndex(
    (it) => it.hcp_id === hcpId
  );
  const path = pathStr.split('.').map(
    (s) => s === 'HCP_ITEM_IDX' ? hcpItemIdx : s
  );
  console.log('::: path = ', path);
  return state.set('engagementPlan', ePlan.updateIn(path, updateCb));
}

function createEpReducer(state = initialState, action) {
  switch (action.type) {
    case fetchCreateEPRequiredDataActions.success.type:
      console.log('### reduce fetchCreateEPRequiredDataActions.success.type');
      return state.merge({
        bcsfs: action.payload.bcsfs,
        medicalPlanObjectives: action.payload.medicalPlanObjectives,
        projects: action.payload.projects,
      });

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
      // const ePlan = state.get('engagementPlan');
      // const hcpItemIdx = ePlan.hcp_items.findIndex(
      //   (it) => it.hcp_id === hcpId
      // );
      // return state.set('engagementPlan', ePlan.updateIn(
      //   ['hcp_items', hcpItemIdx],
      //   (hcpItem) => hcpItem.merge(data)
      // ));
      return updateInEPlanForHCP(
        state, hcpId, 'hcp_items.HCP_ITEM_IDX', (it) => it.merge(data));
    }

    case addHCPObjectiveAction.type: {
      // const ePlan = state.get('engagementPlan');
      // const hcpItemIdx = ePlan.hcp_items.findIndex(
      //   (it) => it.hcp_id === action.hcpId
      // );
      // return state.set('engagementPlan', ePlan.updateIn(
      //   ['hcp_items', hcpItemIdx, 'objectives'],
      //   (objectives) => objectives.push(HCPObjective.fromApiData())
      // ));
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

    default:
      return state;
  }
}

export default createEpReducer;
