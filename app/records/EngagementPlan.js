/* eslint-disable camelcase */
import moment from 'moment';
import { Record, List } from 'immutable';

import { ProjectObjective } from './ProjectObjective';
import { HCPObjective } from './HCPObjective';
import HCP from './HCP';
import Project from './Project';
import Comment from './Comment';

// set fields to undefined to omit them on create request
export class EngagementPlan extends Record({
  id: undefined,
  // relationships
  user_id: null,
  hcp_items: new List(),
  project_items: new List(),
  // fields
  year: moment().format('YYYY'),
  approved: undefined,
  approved_at: undefined,
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'approved',
    'approved_at',
    'created_at',
    'updated_at',
  ];

  toApiData() {
    return this.toJS();
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let ep = new EngagementPlan(data);
    ep = ep.set(
      'hcp_items',
      new List(
        ep.hcp_items.map((hcpItemData) =>
          EngagementPlanHCPItem.fromApiData(
            hcpItemData,
            tasById,
            affiliateGroupsById
          )
        )
      )
    );
    ep = ep.set(
      'project_items',
      new List(
        ep.project_items.map((projectItemData) =>
          EngagementPlanProjectItem.fromApiData(
            projectItemData,
            tasById,
            affiliateGroupsById
          )
        )
      )
    );
    return ep;
  }
}

export class EngagementPlanHCPItem extends Record({
  id: undefined,
  // relationships
  engagement_plan_id: undefined,
  hcp_id: undefined,
  hcp: null,
  objectives: new List(),
  comments: new List(),
  // fields
  reason: '',
  reason_other: '',
  removed_at: null,
  reason_removed: '',
  approved: undefined,
  approved_at: undefined,
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'hcp',
    'comments',
    'approved',
    'approved_at',
    'created_at',
    'updated_at',
  ];

  static reason_choices = {
    reason1: 'Reason 1',
    reason2: 'Reason 2',
    other: 'Other',
  };

  toApiData() {
    const data = this.toJS();
    for (const f of EngagementPlanHCPItem.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let item = new EngagementPlanHCPItem(data);
    item = item.set(
      'objectives',
      new List(
        item.objectives.map((objectiveData) =>
          HCPObjective.fromApiData(objectiveData)
        )
      )
    );
    if (!item.objectives.size) {
      item = item.set('objectives', new List([HCPObjective.fromApiData()]));
    }
    item = item.set(
      'comments',
      new List(
        item.comments.map((commentData) => Comment.fromApiData(commentData))
      )
    );
    item = item.set(
      'hcp',
      HCP.fromApiData(item.hcp, tasById, affiliateGroupsById)
    );
    return item;
  }
}

export class EngagementPlanProjectItem extends Record({
  id: undefined,
  // relationships
  engagement_plan_id: undefined,
  project_id: undefined,
  project: null,
  objectives: new List(),
  comments: new List(),
  // fields
  removed_at: null,
  reason_removed: '',
  approved: undefined,
  approved_at: undefined,
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'project',
    'comments',
    'approved',
    'approved_at',
    'created_at',
    'updated_at',
  ];

  toApiData() {
    const data = this.toJS();
    for (const f of EngagementPlanProjectItem.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let item = new EngagementPlanProjectItem(data);
    item = item.set(
      'objectives',
      new List(
        item.objectives.map((objectiveData) =>
          ProjectObjective.fromApiData(objectiveData)
        )
      )
    );
    if (!item.objectives.size) {
      item = item.set('objectives', new List([ProjectObjective.fromApiData()]));
    }
    item = item.set(
      'comments',
      new List(
        item.comments.map((commentData) => Comment.fromApiData(commentData))
      )
    );
    item = item.set(
      'project',
      Project.fromApiData(item.project, tasById, affiliateGroupsById)
    );
    return item;
  }
}
