/* eslint-disable camelcase */
import { Record } from 'immutable';
import User from './User';

export default class AffiliateGroup extends Record({
  id: undefined,
  user_id: undefined,
  user: null,
  engagement_plan_id: null,
  engagement_plan_hcp_item_id: null,
  engagement_plan_project_item_id: null,
  hcp_objective_id: null,
  project_objective_id: null,
  hcp_deliverable_id: null,
  project_deliverable_id: null,
  message: '',
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = ['user', 'created_at', 'updated_at'];
  toApiData() {
    return this.toJS();
  }
  static fromApiData(data) {
    let item = new AffiliateGroup(data);
    item = item.set('user', User.fromApiData(item.user));
    return item;
  }
}
