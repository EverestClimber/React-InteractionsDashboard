/* eslint-disable camelcase */
import { Record, List } from 'immutable';

export class HCPObjective extends Record({
  id: undefined,
  // relationships
  engagement_plan_item_id: undefined,
  hcp_id: undefined,
  deliverables: new List(),
  bcsf_id: null,
  medical_plan_objective_id: null,
  project_id: null,
  // fields
  description: '',
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
    const data = this.toJS();
    for (const f of HCPObjective.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data) {
    let objective = new HCPObjective(data);
    objective = objective.set(
      'deliverables',
      new List(
        objective.deliverables.map((deliverableData) =>
          HCPDeliverable.fromApiData(deliverableData)
        )
      )
    );
    if (!objective.deliverables.size) {
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
      objective = objective.set(
        'deliverables',
        new List([HCPDeliverable.fromApiData({ quarter: currentQuarter })])
      );
    }
    return objective;
  }
}

export class HCPDeliverable extends Record({
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

  toApiData() {
    return this.toJS();
  }

  static fromApiData(data) {
    return new HCPDeliverable(data);
  }
}
