import { Record, List } from 'immutable';

const hcp = Record({
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

export default hcp;
