/* eslint-disable camelcase */
import { Record, List } from 'immutable';
import HCP from './HCP';
import { HCPObjective } from './HCPObjective';
import Project from './Project';


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
  resources: new List(),
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
  created_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'hcp',
    'hcp_objective',
    'project',
    'created_at',
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

  static fromApiData(data) {
    let interaction = new Interaction(data);
    interaction = interaction.set('resources', new List(interaction.resources));
    interaction = interaction.set('hcp', HCP.fromApiData(interaction.hcp));
    interaction = interaction.set('hcp_objective', HCPObjective.fromApiData(interaction.hcp_objective));
    interaction = interaction.set('project', Project.fromApiData(interaction.project));
    return interaction;
  }
}

export default Interaction;
