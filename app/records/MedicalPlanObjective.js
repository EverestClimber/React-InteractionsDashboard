/* eslint-disable camelcase */
import { List, Record } from 'immutable';


export class MedicalPlanObjective extends Record({
  id: undefined,
  // relationships
  affiliate_groups: new List(),
  ta_id: null,
  // fields
  name: '',
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'created_at',
    'updated_at',
  ];

  toApiData() {
    const data = this.toJS();
    for (const f of MedicalPlanObjective.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data) {
    return new MedicalPlanObjective(data);
  }
}

export default MedicalPlanObjective;
