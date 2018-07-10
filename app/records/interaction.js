/* eslint-disable camelcase */
import { Record } from 'immutable';

class Interaction extends Record({
  id: undefined,
  // relationships
  user_id: null,
  hcp_id: null,
  hcp: null,
  hcp_objective_id: null,
  hcp_objective: null,
  project_id: null,
  project: null,
  resources: [],
  // fields
  time_of_interaction: '',
  description: '',
  purpose: 'purpose',
  is_joint_visit: false,
  joint_visit_with: '',
  joint_visit_reason: '',
  origin_of_interaction: '',
  origin_of_interaction_other: '',
  type_of_interaction: '',
  is_proactive: false,
  is_adverse_event: false,
  appropriate_pv_procedures_followed: null,
  outcome: '',
  is_follow_up_required: false,
}) {
  static READ_ONLY_FIELDS = [
    'hcp',
    'hcp_objective',
    'project',
  ];

  static origin_of_interaction_choices = {
    medinfo_enquiry: 'Medical Info Enquiry',
    engagement_plan: 'Engagement Plan',
    other: 'Other',
  };

  static type_of_interaction_choices = {
    phone: 'Phone',
    face_to_face: 'Face To Face',
    email: 'Email',
  };

  static outcome_choices = {
    follow_up: 'Follow up',
    no_further_actions: 'No further actions',
  };

  toApiData() {
    const data = this.toJS();
    for (const f of Interaction.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }
}

export default Interaction;
