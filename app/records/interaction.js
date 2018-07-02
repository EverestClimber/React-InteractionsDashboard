import { Record } from 'immutable';

const Interaction = Record({
  id: undefined,
  hcp_id: null,
  description: null,
  purpose: null,
  hcp_objective_id: null,
  project_id: null,
  resources: [],
  outcomes: [],
  is_joint_visit: false,
  joint_visit_with: null,
  origin_of_interaction: null,
  origin_of_interaction_other: null,
  is_adverse_event: false,
  appropriate_procedures_followed: false,
  is_follow_up_required: false,
});

Interaction.originOfInteraction = [
  { name: 'Medical Info Enquiry', value: 'medinfo_enquiry' },
  { name: 'Engagement Plan', value: 'engagement_plan' },
  { name: 'Other', value: 'other' },
];

Interaction.typeOfInteraction = [
  { name: 'Phone', value: 'phone' },
  { name: 'Face To Face', value: 'face_to_face' },
  { name: 'Other', value: 'other' },
];

export default Interaction;
