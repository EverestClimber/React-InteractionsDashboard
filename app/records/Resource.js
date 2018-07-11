/* eslint-disable camelcase */
import { Record, List } from 'immutable';


export class Resource extends Record({
  id: undefined,
  // relationships
  user_id: '',
  affiliate_groups: new List(),
  affiliate_group_names: new List(),
  tas: new List(),
  ta_names: new List(),
  // fields
  title: '',
  description: '',
  zinc_number_global: '',
  zinc_number_country: '',
  url: '',
  file: '',
  created_at: null,
  updated_at: null,
}) {
  static READ_ONLY_FIELDS = [
    'created_at',
    'updated_at',
    'ta_names',
    'affiliate_group_names',
  ];

  toApiData() {
    const data = this.toJS();
    for (const f of Resource.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let project = new Resource(data);
    project = project.set('affiliate_groups', new List(project.affiliate_groups));
    project = project.set('tas', new List(project.tas));
    if (tasById) {
      project = project.set('ta_names', new List(project.tas.map(
        (taId) => tasById.getIn([taId, 'name'], '')
      )));
    }
    if (affiliateGroupsById) {
      project = project.set('affiliate_group_names', new List(project.affiliate_groups.map(
        (agId) => affiliateGroupsById.getIn([agId, 'name'], '')
      )));
    }
    return project;
  }
}

export default Resource;
