/* eslint-disable camelcase */
import { Record } from 'immutable';


export default class AffiliateGroup extends Record({
  id: undefined,
  name: '',
}) {
  toApiData() {
    return this.toJS();
  }
  static fromApiData(data) {
    return new AffiliateGroup(data);
  }
}
