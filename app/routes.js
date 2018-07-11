const routes = {
  DASHBOARD: { path: '/' },
  LOGIN: { path: '/login' },
  PROFILE: { path: '/profile' },
  HCP_DIRECTORY: { path: '/hcp-directory' },
  RECORD_INTERACTION: { path: '/record-interaction' },
  RECORD_INTERACTION_FOR_EP: {
    path: '/record-interaction/for-engagement-plan/:engagementPlanId',
    make: (engagementPlanId) => `/record-interaction/for-engagement-plan/${engagementPlanId}`,
  },
  RECORD_INTERACTION_FOR_HCP: {
    path: '/record-interaction/for-hcp/:hcpId',
    make: (hcpId) => `/record-interaction/for-hcp/${hcpId}`,
  },
  REPORT: { path: '/report' },
  NOT_FOUND: { path: '*' },
};

export default routes;
