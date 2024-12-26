export const formatToPostgresArray = (array: string[]) =>
  `{${array.join(',')}}`;

export const paginateArray = <T>(array: T[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;

  return array.slice(start, end);
};

export const chunkArray = <T>(array: T[], size: number) => {
  const chunkedArray = [];

  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }

  return chunkedArray;
};

export const generatePassword = (length = 12) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < length; i += 1) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
};

export const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i += 1) {
    if (i === 3) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

export const setSlugs = (url: string, data: Record<string, any>): string =>
  Object.keys(data).reduce(
    (acc, key) => acc.replace(`[${key}]`, encodeURIComponent(data[key])),
    url,
  );

export const setParams = (url: string, data: Record<string, any>): string =>
  `${url}?${new URLSearchParams(data).toString()}`;

export const getRandomElements = <T>(array: T[], count?: number) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
