import { Record, List } from 'immutable';
import moment from 'moment';

// set fields to undefined omit them on create request
const EngagementPlan = Record({
  id: undefined,
  user_id: null,
  year: moment().format('YYYY-MM-DD'),
  approved: undefined,
  approved_at: undefined,
  hcp_items: new List(),
  project_items: new List(),
  created_at: undefined,
  updated_at: undefined,
});

export default EngagementPlan;
