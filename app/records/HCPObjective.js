/* eslint-disable camelcase */
import { Record, List } from 'immutable';


export class HCPObjective extends Record({
  id: undefined,
  // relationships
  engagement_plan_item_id: undefined,
  hcp_id: undefined,
  deliverables: new List(),
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
    objective = objective.set('deliverabled', objective.deliverables.map(
      (deliverableData) => HCPDeliverable.fromApiData(deliverableData)
    ));
    return objective;
  }
}


export class HCPDeliverable extends Record({
  id: undefined,
  // relationships
  objective_id: undefined,
  // fields
  quarter: 1,
  description: '',
  status: '',
}) {
  toApiData() {
    return this.toJS();
  }

  static fromApiData(data) {
    return new HCPDeliverable(data);
  }
}
