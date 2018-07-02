import { Record, List } from 'immutable';

const HCP = Record({
  id: undefined,
  first_name: '',
  last_name: '',
  email: '',
  institution_name: '',
  institution_address: '',
  contact_preference: '',
  affiliate_groups: new List(),
  tas: new List(),
});

HCP.fromApiObject = (obj) => {
  let hcp = new HCP(obj);
  hcp = hcp.set('affiliate_groups', new List(hcp.get('affiliate_groups')));
  hcp = hcp.set('tas', new List(hcp.get('tas')));

  return hcp;
};

export default HCP;
