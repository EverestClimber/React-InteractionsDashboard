import { Record } from 'immutable';

const User = Record({
  id: undefined,
  email: '',
  group_names: [],
  permissions: [],
  affiliate_groups: [],
  tas: [],
});

export default User;
