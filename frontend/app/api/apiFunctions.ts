import { fetcher, FetcherOptions } from '@/utils/fetcher';
import { UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { setParams, setSlugs } from '@/utils/utils';
import { forEach, keys } from 'lodash';
import { EndpointDetail } from './endpoints';

type PrepareDataOptions<T> = {
  slugs?: { [key: string]: string | undefined };
  dynamicKeys?: any[];
  params?: { [key: string]: string | undefined };
  data?: any;
  fetcherOptions?: FetcherOptions & {
    dependencies?: { slugs?: string[]; params?: string[] };
  };
  queryOptions?: Omit<Omit<UseQueryOptions<T>, 'queryKey'>, 'queryFn'>;
};

const prepareData = <T>(
  key: string,
  route: string,
  options?: PrepareDataOptions<T>,
) => {
  const { slugs, dynamicKeys, params } = options || {};
  const keys: string[] = [key];

  let newRoute = route;
  if (slugs) newRoute = setSlugs(newRoute, slugs);
  if (dynamicKeys) keys.push(...dynamicKeys);
  if (params) newRoute = setParams(newRoute, params);

  return {
    keys,
    route: newRoute,
  };
};

export const fetchAPI = async <T = any>(
  endpoint: EndpointDetail,
  options?: Omit<PrepareDataOptions<T>, 'queryOptions'>,
) => {
  const { route } = prepareData(endpoint.key, endpoint.route, options);
  const { data, fetcherOptions } = options || {};
  const { dependencies } = fetcherOptions || {};

  if (dependencies) {
    const error = { error: 'Missing dependency', status: 400 };

    forEach(keys(dependencies), (depKey) => {
      const key = depKey as 'params' | 'slugs';
      const dep = dependencies[key] as string[];

      if (dep) {
        forEach(dep, (depValue) => {
          if (!options?.[key]?.[depValue]) return error;
        });
      }
    });
  }

  return fetcher<T>(endpoint.method, fetcherOptions, route, data);
};

export const getQueryData = <T, D = UseQueryOptions<T, AxiosError, T>>(
  endpoint: EndpointDetail,
  options?: PrepareDataOptions<T>,
) => {
  const { keys, route } = prepareData(endpoint.key, endpoint.route, options);
  const { data, fetcherOptions, queryOptions } = options || {};

  return {
    ...queryOptions,
    queryKey: keys,
    queryFn: () => fetcher<T>(endpoint.method, fetcherOptions, route, data),
  } as D;
};
