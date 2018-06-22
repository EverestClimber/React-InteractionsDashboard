import { Record } from 'immutable';

const Interaction = Record({
  id: undefined,
  hcp_id: null,
  description: '',
  purpose: '',
  hcp_objective_id: null,
  project_id: null,
  resources: [],
  outcomes: [],
  is_joint_visit: false,
  joint_visit_with: '',
  origin_of_interaction: '',
  origin_of_interaction_other: '',
  is_adverse_event: false,
  appropriate_procedures_followed: false,
  is_follow_up_required: false,
});

export default Interaction;
