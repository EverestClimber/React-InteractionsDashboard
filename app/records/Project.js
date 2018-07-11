/* eslint-disable camelcase */
import { Record, List } from 'immutable';


export class Project extends Record({
  id: undefined,
  // relationships
  affiliate_groups: new List(),
  affiliate_group_names: new List(),
  tas: new List(),
  ta_names: new List(),
  // fields
  title: '',
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
    for (const f of Project.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let project = new Project(data);
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

export default Project;
