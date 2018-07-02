import { Record, List } from 'immutable';

import Deliverable from './deliverable';

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

Objective.fromApiObject = (obj) => {
  let objective = new Objective(obj);

  objective = objective.set(
    'deliverables',
    new List(objective.get('deliverables').map(
      (deliverable) => new Deliverable(deliverable)
    ))
  );

  return objective;
};

export default Objective;
