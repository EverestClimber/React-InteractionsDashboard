const routes = {
  DASHBOARD: { path: '/' },
  LOGIN: { path: '/login' },
  PASSWORD_RESET: { path: '/password/reset' },
  PASSWORD_RESET_CONFIRM: {
    path: '/password/reset/confirm/:uid/:token',
    makePath: (uid, token) => `/password/reset/confirm/${uid}/${token}`,
  },
  PROFILE: { path: '/profile' },
  HCP_DIRECTORY: { path: '/hcp-directory' },
  LIST_INTERACTIONS: { path: '/interactions' },
  LIST_HCPS: { path: '/hcps' },
  RECORD_INTERACTION: { path: '/record-interaction' },
  CREATE_EP: { path: '/engagement-plans/create' },
  UPDATE_EP: {
    path: '/engagement-plans/:engagementPlanId',
    makePath: (engagementPlanId) => `/engagement-plans/${engagementPlanId}`,
  },
  REPORT: { path: '/report' },
  NOT_FOUND: { path: '*' },
};

export default routes;

export function pageDoesNotRequireLogin() {
  return (
    window.location.pathname === routes.LOGIN.path ||
    window.location.pathname.indexOf('/password/reset') !== -1
  );
}
