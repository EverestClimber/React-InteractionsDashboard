/* eslint-disable camelcase */
import { Record, List } from 'immutable';
import Comment from './Comment';

export class ProjectObjective extends Record({
  id: undefined,
  // relationships
  engagement_plan_item_id: undefined,
  project_id: undefined,
  deliverables: new List(),
  bcsf_id: null,
  medical_plan_objective_id: null,
  comments: new List(),
  // fields
  description: '',
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = ['created_at', 'updated_at'];

  toApiData() {
    const data = this.toJS();
    for (const f of ProjectObjective.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data) {
    let objective = new ProjectObjective(data);
    objective = objective.set(
      'deliverables',
      new List(
        objective.deliverables.map((deliverableData) =>
          ProjectDeliverable.fromApiData(deliverableData)
        )
      )
    );
    if (!objective.deliverables.size) {
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
      objective = objective.set(
        'deliverables',
        new List([ProjectDeliverable.fromApiData({ quarter: currentQuarter })])
      );
    }
    objective = objective.set(
      'comments',
      new List(
        objective.comments.map((commentData) =>
          Comment.fromApiData(commentData)
        )
      )
    );
    return objective;
  }
}

export class ProjectDeliverable extends Record({
  id: undefined,
  // relationships
  objective_id: undefined,
  comments: new List(),
  // fields
  quarter: 1,
  quarter_type: 'present',
  description: '',
  status: '',
}) {
  static READ_ONLY_FIELDS = ['quarter_type', 'created_at', 'updated_at'];

  static status_choices = {
    on_track: 'On Track',
    slightly_behind: 'Slightly Behind',
    major_issue: 'Major Issue',
    '': 'No Status',
  };

  static quarter_type_choices = {
    past: 'past',
    current: 'current',
    future: 'future',
  };

  toApiData() {
    return this.toJS();
  }

  static fromApiData(data) {
    let item = new ProjectDeliverable(data);
    item = item.set(
      'comments',
      new List(
        item.comments.map((commentData) => Comment.fromApiData(commentData))
      )
    );
    return item;
  }
}
