/* eslint-disable camelcase */
import { Record, List } from 'immutable';

export class ProjectObjective extends Record({
  id: undefined,
  // relationships
  engagement_plan_item_id: undefined,
  project_id: undefined,
  deliverables: new List(),
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
    return objective;
  }
}

export class ProjectDeliverable extends Record({
  id: undefined,
  // relationships
  objective_id: undefined,
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
    return new ProjectDeliverable(data);
  }
}
