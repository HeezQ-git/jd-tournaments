export enum HTTPMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface EndpointDetail {
  method: HTTPMethods;
  route: string;
  key: string;
}

export type Endpoints = {
  [key: string]: EndpointDetail;
};

export const songsEndpoints = {
  getAll: {
    method: HTTPMethods.GET,
    key: 'song',
    route: '/api/songs',
  },
  create: {
    method: HTTPMethods.POST,
    key: 'createSong',
    route: '/api/songs',
  },
  edit: {
    method: HTTPMethods.PATCH,
    key: 'editSong',
    route: '/api/songs/[id]',
  },
  delete: {
    method: HTTPMethods.DELETE,
    key: 'deleteSong',
    route: '/api/songs/[id]',
  },
  getDistinctData: {
    method: HTTPMethods.GET,
    key: 'distinct',
    route: '/api/songs/data/distinct',
  },
  getSingle: {
    method: HTTPMethods.GET,
    key: 'song',
    route: '/api/songs',
  },
  addImage: {
    method: HTTPMethods.POST,
    key: 'image',
    route: '/api/songs/[id]/image',
  },
  deleteImage: {
    method: HTTPMethods.DELETE,
    key: 'deleteImage',
    route: '/api/songs/[id]/image',
  },
};

export const usersEndpoints = {
  getAll: {
    method: HTTPMethods.GET,
    key: 'user',
    route: '/api/user',
  },
  create: {
    method: HTTPMethods.POST,
    key: 'createUser',
    route: '/api/user',
  },
  edit: {
    method: HTTPMethods.PATCH,
    key: 'editUser',
    route: '/api/user/[id]',
  },
  delete: {
    method: HTTPMethods.DELETE,
    key: 'deleteUser',
    route: '/api/user/[id]',
  },
};

export const verificationEndpoints = {
  checkVerification: {
    method: HTTPMethods.GET,
    key: 'verification',
    route: '/api/user/check-verification',
  },
  generateVerificationCode: {
    method: HTTPMethods.POST,
    key: 'generateVerificationCode',
    route: '/api/user/generate-verification-code',
  },
};

export const permissionsEndpoints = {
  getAll: {
    method: HTTPMethods.GET,
    key: 'permissions',
    route: '/api/permissions',
  },
  set: {
    method: HTTPMethods.POST,
    key: 'setPermissions',
    route: '/api/permissions',
  },
};

export const tournamentsEndpoints = {
  getAllUsers: {
    method: HTTPMethods.GET,
    key: 'tournamentsUsers',
    route: '/api/tournaments/users',
  },
  create: {
    method: HTTPMethods.POST,
    key: 'create',
    route: '/api/tournaments',
  },
  save: {
    method: HTTPMethods.PATCH,
    key: 'save',
    route: '/api/tournaments',
  },
};
