const routes = {
  DASHBOARD: { path: '/' },
  LOGIN: { path: '/login' },
  PASSWORD_RESET: { path: '/password/reset' },
  PROFILE: { path: '/profile' },
  HCP_DIRECTORY: { path: '/hcp-directory' },
  LIST_INTERACTIONS: { path: '/interactions' },
  RECORD_INTERACTION: { path: '/record-interaction' },
  CREATE_EP: { path: '/engagement-plans/create' },
  UPDATE_EP: {
    path: '/engagement-plans/:engagementPlanId',
    makePath(engagementPlanId) {
      return `/engagement-plans/${engagementPlanId}`;
    },
  },
  REPORT: { path: '/report' },
  NOT_FOUND: { path: '*' },
};

export default routes;
