import i18next from 'i18next';

declare global {
  type TransFunction = typeof i18next.t;
}

interface FetcherResponse<T> {
  data: T;
  status: number;
  statusText: string;
  error: Error | null;
  count: number | null;
}

// eslint-disable-next-line prettier/prettier
export { };
