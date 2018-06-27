import { Record, List } from 'immutable';

// can be used both for hcp and project objectives
const Objective = Record({
  id: undefined,
  engagement_plan_item_id: null,
  hcp_id: undefined,
  project_id: undefined,
  description: '',
  deliverables: new List(),
  created_at: undefined,
  updated_at: undefined,
});

export default Objective;
