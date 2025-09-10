// apiPath.ts
const apiPath = Object.freeze({
  loginUser: "/v1/admin/login",
  forgetPassword: "/v1/admin/forgot-password",
  resetPassword: "/v1/admin/reset-password",
  changePassword: "/v1/admin/change-password",
  getSubadmin: "/v1/admin/subAdmin",
  subadminChangeStatus: '/v1/admin/subadmin',
  subAdminCreate: '/v1/admin/subadmin/create',
  changeStatus: '/v1/admin/change-status',
  generatePreSignUrl: "/v1/admin/generate-presigned-url",
  editProfile: "/v1/admin/edit-profile",
  emailTemplate: '/v1/admin/email-templates',
  getStaticContent: '/v1/admin/static-content',
  getFAQ: '/v1/admin/faq',
  reOrderFaq: "/v1/admin/faq/reorder",
  getCircles: '/v1/admin/circle',
  getEvents: '/v1/admin/event',
  getIntent: '/v1/admin/intent',
  getDashboardData: '/v1/admin/dashboard',
  getNotifications: '/v1/admin/notifications',
  getUsers: '/v1/admin/user',
  getCircleIntent: "/v1/admin/intent/active-intents",
  getReports: '/v1/admin/report',
  getSecretCrush: '/v1/admin/secret-crush',
  getSetting: '/v1/admin/setting',
  getAllCircle: '/v1/admin/circle/all',
  getCircleJoinRequest: '/v1/admin/circle/join-requests',
  acceptRejectCircleRequest:'/v1/admin/circle/respond-to-join-request'
} as const);

// TypeScript: keys are exact, values are string literals
type ApiPathKeys = keyof typeof apiPath;
type ApiPathValue = (typeof apiPath)[ApiPathKeys];

export type { ApiPathKeys, ApiPathValue };
export default apiPath;
