const PERMISSIONS = {
  SUPERADMIN: 'superadmin',
  ACCESS: {
    SONGS: {
      ADD: 'access.songs.add',
      BULK_ADD: 'access.songs.bulkAdd',
      EDIT: 'access.songs.edit',
      LIST: 'access.songs.list',
    },
    USERS: {
      LIST: 'access.users.list',
      PERMISSIONS: 'access.users.permissions',
    },
  },
  PERMISSIONS: {
    EDIT: 'permissions.edit',
    READ: 'permissions.read',
  },
  USERS: {
    EDIT: 'users.edit',
    READ: 'users.read',
    CREATE: 'users.create',
    DELETE: 'users.delete',
  },
  SONGS: {
    EDIT: 'songs.edit',
    CREATE: 'songs.create',
    DELETE: 'songs.delete',
  }
};

export default PERMISSIONS;
