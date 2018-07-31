import axios from './config';

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
    url: `/engagement-plans/${id}/`,
  };

  return axios(config);
}

export function patchEngagementPlan(id, engagementPlan) {
  const config = {
    method: 'PATCH',
    url: `/engagement-plans/${id}/`,
    data: engagementPlan,
  };

  return axios(config);
}

export function deleteEngagementPlan(id) {
  const config = {
    method: 'DELETE',
    url: `/engagement-plans/${id}/`,
  };

  return axios(config);
}

export function approveEngagementPlan(
  id,
  approveAllHCPItems,
  approveHCPItemsIds
) {
  const config = {
    method: 'POST',
    url: `/engagement-plans/${id}/approve/`,
    data: {
      hcp_items: approveAllHCPItems,
      hcp_items_ids: approveHCPItemsIds,
    },
  };

  return axios(config);
}
