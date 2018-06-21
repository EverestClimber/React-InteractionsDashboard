import { Record, List } from 'immutable';
import moment from 'moment';

// set fields to undefined omit them on create request
const engagementPlan = Record({
  id: undefined,
  user: null,
  year: moment().format('YYYY-MM-DD'),
  approved: undefined,
  approved_at: undefined,
  engagement_list_items: new List(),
  hcp_objectives: new List(),
  created_at: undefined,
  updated_at: undefined,
});

export default engagementPlan;
