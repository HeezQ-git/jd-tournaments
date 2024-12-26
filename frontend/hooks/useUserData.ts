/* eslint-disable prettier/prettier */

'use client';

import { useEffect, useState } from 'react';
import { Database } from '@/database.types';
import { useUserStore } from '@/stores/userStore';
import { isArray, isObject, isString, join, merge } from 'lodash';
import { getDataWithService } from './serviceFunctions';

type DataToGetObject = { name: string; table?: keyof Database["public"]["Tables"]; id?: string };

type DataToGetType =
  | DataToGetObject[]
  | string[];

export const useUserData = (dataToGet: DataToGetType, id?: string) => {
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { userMetadata } = useUserStore();
  const userId = id || userMetadata?.id;

  useEffect(() => {
    if (!userId || userData) return;

    (async () => {
      if (isArray(dataToGet) && isObject(dataToGet[0])) {
        const responses = await Promise.all(
          (dataToGet as DataToGetObject[]).map(async ({ name, table, id }) => {
            const queryId = id || userId;
            const { data, error } = await getDataWithService({
              table, select: name, queryId
            })

            if (!id) {
              if (error) return { [name]: null };
              return data;
            }

            return error ? { [queryId]: null } : { [id]: data };
          })
        );

        const combinedData = merge({}, ...responses);

        setUserData(combinedData);
      } else if (isArray(dataToGet) && isString(dataToGet[0])) {
        const queryId = id || userId;

        const { data } = await getDataWithService({
          select: join(dataToGet, ", "),
          queryId
        });

        setUserData(data);
      }

      setLoaded(true);
    })();
  }, [userId, dataToGet, id]);

  return { ...userData, loaded } as Record<string, any>;
};
