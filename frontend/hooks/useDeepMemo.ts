import { useRef } from 'react';
import isEqual from 'lodash/isEqual';

interface RefType<T> {
  value: T;
  dependencies: any[];
}

function useDeepMemo<T>(factory: () => T, dependencies: any[]): T {
  const ref = useRef<RefType<T> | undefined>(undefined);

  if (!ref.current || !isEqual(dependencies, ref.current.dependencies)) {
    ref.current = {
      value: factory(),
      dependencies,
    };
  }

  return ref.current.value;
}

export default useDeepMemo;
