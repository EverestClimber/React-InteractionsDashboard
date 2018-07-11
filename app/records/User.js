/* eslint-disable camelcase */
import { List, Record } from 'immutable';

export class User extends Record({
  id: undefined,
  // relationships
  affiliate_groups: new List(),
  affiliate_group_names: new List(),
  tas: new List(),
  ta_names: new List(),
  // fields
  email: '',
  group_names: [],
  permissions: [],
}) {
  static READ_ONLY_FIELDS = [
    'created_at',
    'updated_at',
    'ta_names',
    'affiliate_group_names',
  ];

  toApiData() {
    const data = this.toJS();
    for (const f of User.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let user = new User(data);
    user = user.set('affiliate_groups', new List(user.affiliate_groups));
    user = user.set('tas', new List(user.tas));
    if (tasById) {
      user = user.set('ta_names', new List(user.tas.map(
        (taId) => tasById.getIn([taId, 'name'], '')
      )));
    }
    if (affiliateGroupsById) {
      user = user.set('affiliate_group_names', new List(user.affiliate_groups.map(
        (agId) => affiliateGroupsById.getIn([agId, 'name'], '')
      )));
    }
    return user;
  }
}

export default User;
