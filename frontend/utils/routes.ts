const ROUTES = {
  ADMIN: {
    HOME: '/admin/song/list',
    SONG: {
      SELF: '/admin/song',
      LIST: '/admin/song/list',
      ADD: '/admin/song/add',
      BULK_ADD: '/admin/song/add/bulk',
      EDIT: '/admin/song/edit',
    },
    USER: {
      LIST: '/admin/user/list',
      PERMISSIONS: '/admin/user/[id]/permissions',
    },
  },
  USER: {
    VERIFY: '/verification',
    TICKETS: '/tickets',
    TOURNAMENT: {
      SELF: '/tournament',
      LIST: '/tournament/list',
      CREATE: '/tournament/manage',
      CREATED: '/tournament/created',
    },
  },
  GUEST: {
    AUTH: '/auth',
    LOGOUT: '/logout',
    FINALIZE: '/auth/finalize',
  },
  HOME: '/',
};

export default ROUTES;
