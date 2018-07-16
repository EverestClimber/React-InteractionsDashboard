/* eslint-disable camelcase */
import { Record, List } from 'immutable';


class HCP extends Record({
  id: undefined,
  // relationships
  affiliate_groups: new List(),
  affiliate_group_names: new List(),
  tas: new List(),
  ta_names: new List(),
  // fields
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  contact_person_first_name: '',
  contact_person_last_name: '',
  contact_person_email: '',
  contact_person_phone: '',
  time_availability: '',
  institution_name: '',
  institution_address: '',
  contact_preference: '',
  has_consented: false,
  created_at: undefined,
  updated_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'created_at',
    'updated_at',
    'ta_names',
    'affiliate_group_names',
  ];

  toApiData() {
    const data = this.toJS();
    for (const f of HCP.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data, tasById = null, affiliateGroupsById = null) {
    let hcp = new HCP(data);
    hcp = hcp.set('affiliate_groups', new List(hcp.affiliate_groups));
    hcp = hcp.set('tas', new List(hcp.tas));
    if (tasById) {
      hcp = hcp.set('ta_names', new List(hcp.tas.map(
        (taId) => tasById.getIn([taId, 'name'], '')
      )));
    }
    if (affiliateGroupsById) {
      hcp = hcp.set('affiliate_group_names', new List(hcp.affiliate_groups.map(
        (agId) => affiliateGroupsById.getIn([agId, 'name'], '')
      )));
    }
    return hcp;
  }
}

export default HCP;
