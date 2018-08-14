/* eslint-disable camelcase */
import { Record, List } from 'immutable';
import HCP from './HCP';
import { HCPObjective } from './HCPObjective';
import Project from './Project';

class Interaction extends Record({
  id: undefined,
  // relationships
  user_id: null,
  user: null,
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
  is_joint_visit_manager_approved: false,
  joint_visit_with: '',
  joint_visit_reason: '',
  joint_visit_reason_other: '',
  origin_of_interaction: '',
  origin_of_interaction_other: '',
  type_of_interaction: '',
  is_proactive: false,
  is_adverse_event: false,
  appropriate_pv_procedures_followed: null,
  outcome: '',
  follow_up_date: undefined,
  follow_up_notes: '',
  no_follow_up_required: false,
  created_at: undefined,
}) {
  static READ_ONLY_FIELDS = [
    'user',
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

  static joint_visit_reason_choices = {
    option1: 'Option 1',
    option2: 'Option 2',
    other: 'Other',
  };

  toApiData() {
    const data = this.toJS();
    for (const f of Interaction.READ_ONLY_FIELDS) {
      delete data[f];
    }
    return data;
  }

  static fromApiData(data) {
    let interaction = new Interaction({
      ...data,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      time_of_interaction: data.time_of_interaction
        ? new Date(data.time_of_interaction)
        : undefined,
    });
    interaction = interaction.set('resources', new List(interaction.resources));
    interaction = interaction.set('hcp', HCP.fromApiData(interaction.hcp));
    interaction = interaction.set(
      'hcp_objective',
      HCPObjective.fromApiData(interaction.hcp_objective)
    );
    interaction = interaction.set(
      'project',
      Project.fromApiData(interaction.project)
    );
    return interaction;
  }
}

export default Interaction;
