/* eslint-disable camelcase */
import moment from 'moment';
import { Record, List } from 'immutable';

import { ProjectObjective } from './ProjectObjective';
import { HCPObjective } from './HCPObjective';
import HCP from './HCP';
import Project from './Project';

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

  static fromApiData(data) {
    let ep = new EngagementPlan(data);
    ep = ep.set(
      'hcp_items',
      new List(
        ep.hcp_items.map((hcpItemData) =>
          EngagementPlanHCPItem.fromApiData(hcpItemData)
        )
      )
    );
    ep = ep.set(
      'project_items',
      new List(
        ep.project_items.map((projectItemData) =>
          EngagementPlanProjectItem.fromApiData(projectItemData)
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

  static fromApiData(data) {
    let item = new EngagementPlanHCPItem(data);
    item = item.set(
      'objectives',
      new List(
        item.objectives.map((objectiveData) =>
          HCPObjective.fromApiData(objectiveData)
        )
      )
    );
    item = item.set('hcp', HCP.fromApiData(item.hcp));
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

  static fromApiData(data) {
    let item = new EngagementPlanProjectItem(data);
    item = item.set(
      'objectives',
      new List(
        item.objectives.map((objectiveData) =>
          ProjectObjective.fromApiData(objectiveData)
        )
      )
    );
    item = item.set('project', Project.fromApiData(item.project));
    return item;
  }
}
