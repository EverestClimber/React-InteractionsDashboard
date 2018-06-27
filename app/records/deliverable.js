import { Record } from 'immutable';

// can be used both for hcp and project objective deliverables
const Deliverable = Record({
  id: undefined,
  objective_id: null,
  quarter: null,
  description: '',
  status: null,
});

export default Deliverable;
