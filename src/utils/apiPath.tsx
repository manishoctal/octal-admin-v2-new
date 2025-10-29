// apiPath.ts
const apiPath = Object.freeze({
  loginUser: "/v2/admin/login",
  forgetPassword: "/v2/admin/forgot-password",
  resetPassword: "/v2/admin/reset-password",
  changePassword: "/v2/admin/change-password",
  getSubadmin: "/v2/admin/subAdmin",
  subadminChangeStatus: '/v2/admin/subadmin',
  subAdminCreate: '/v2/admin/subadmin/create',
  changeStatus: '/v2/admin/change-status',
  generatePreSignUrl: "/v2/admin/generate-presigned-url",
  editProfile: "/v2/admin/edit-profile",
  emailTemplate: '/v2/admin/email-templates',
  getStaticContent: '/v2/admin/static-content',
  getFAQ: '/v2/admin/faq',
  reOrderFaq: "/v2/admin/faq/reorder",
  getCircles: '/v2/admin/circle',
  getEvents: '/v2/admin/event',
  getIntent: '/v2/admin/intent',
  getDashboardData: '/v2/admin/dashboard',
  getNotifications: '/v2/admin/notifications',
  getUsers: '/v2/admin/user',
  getCircleIntent: "/v2/admin/intent/active-intents",
  getReports: '/v2/admin/report',
  getSecretCrush: '/v2/admin/secret-crush',
  getSetting: '/v2/admin/setting',
  getAllCircle: '/v2/admin/circle/all',
  getCircleJoinRequest: '/v2/admin/circle/join-requests',
  acceptRejectCircleRequest:'/v2/admin/circle/respond-to-join-request',
  getErrorLogs:'/v2/admin/error-logs'
} as const);

// TypeScript: keys are exact, values are string literals
type ApiPathKeys = keyof typeof apiPath;
type ApiPathValue = (typeof apiPath)[ApiPathKeys];

export type { ApiPathKeys, ApiPathValue };
export default apiPath;
