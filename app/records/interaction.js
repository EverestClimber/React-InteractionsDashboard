import { Record } from 'immutable';

const Interaction = Record({
  id: undefined,
  // relationships
  hcp_id: null,
  hcp_objective_id: null,
  project_id: null,
  resources: [],
  outcomes: [],
  // fields
  description: null,
  purpose: null,
  is_joint_visit: false,
  joint_visit_with: null,
  origin_of_interaction: null,
  origin_of_interaction_other: null,
  type_of_interaction: null,
  is_adverse_event: false,
  appropriate_pv_procedures_followed: false,
  is_follow_up_required: false,
});

Interaction.origin_of_interaction_choices = {
  medinfo_enquiry: 'Medical Info Enquiry',
  engagement_plan: 'Engagement Plan',
  other: 'Other',
};

Interaction.type_of_interaction_choices = {
  phone: 'Phone',
  face_to_face: 'Face To Face',
  other: 'Other',
};

export default Interaction;
