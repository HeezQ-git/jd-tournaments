import axios from 'axios';

export const defaultUrlBase =
  process.env.NODE_ENV === 'production'
    ? 'http://217.78.237.73:3000/'
    : 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: defaultUrlBase,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': defaultUrlBase,
    'Access-Control-Allow-Credentials': 'true',
  },
});

export default axiosInstance;
