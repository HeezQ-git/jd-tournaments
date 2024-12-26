/* eslint-disable prettier/prettier */
import axiosInstance from './axiosInstance';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetcherOptions {
  base?: string;
  wholeResponse?: boolean;
  timeout?: number;
  isBlob?: boolean;
}

export const fetcher =
  async <T = any>(method: Method, options?: FetcherOptions, url?: string, data?: any): Promise<T> => {
    const { base, wholeResponse, timeout, isBlob } = options || {};

    const config: any = {
      method,
      url,
      data,
      timeout: timeout || 30000,
    };

    if (isBlob) config.headers = {
      'Content-Type': 'multipart/form-data',
    };

    if (base) config.baseURL = base;

    const response = await axiosInstance(config);

    return wholeResponse ? response : response.data;
  };
