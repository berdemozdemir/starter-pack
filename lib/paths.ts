export const paths = {
  home: '/',

  dashboard: {
    base: '/dashboard',
  },

  admin: {
    base: '/admin',
  },

  unauthorized: '/unauthorized',

  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    callback: '/auth/callback',
  },
} as const;
