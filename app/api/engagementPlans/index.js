import axios from '../config';

export function getEngagementPlans() {
  const config = {
    method: 'GET',
    url: '/engagement-plans/',
  };

  return axios(config);
}

export function postEngagementPlan(engagementPlan) {
  const config = {
    method: 'POST',
    url: '/engagement-plans/',
    data: engagementPlan,
  };

  return axios(config);
}

export function getEngagementPlan(id) {
  const config = {
    method: 'GET',
    url: `/engagement-plans/${id}`,
  };

  return axios(config);
}

export function patchEngagementPlan(id, engagementPlan) {
  const config = {
    method: 'PATCH',
    url: `/engagement-plans/${id}`,
    data: engagementPlan,
  };

  return axios(config);
}

export function deleteEngagementPlan(id) {
  const config = {
    method: 'DELETE',
    url: `/engagement-plans/${id}`,
  };

  return axios(config);
}

export function approveEngagementPlan(
  id,
  approveAllEngagementListItems,
  approveAllHcpObjectives,
  engagementListItems,
  hcpObjectives
) {
  const config = {
    method: 'POST',
    url: `/engagement-plans/${id}/approve/`,
    data: {
      engagement_list_items: approveAllEngagementListItems,
      hcp_objectives: approveAllHcpObjectives,
      engagement_list_items_ids: engagementListItems,
      hcp_objectives_ids: hcpObjectives,
    },
  };

  return axios(config);
}
