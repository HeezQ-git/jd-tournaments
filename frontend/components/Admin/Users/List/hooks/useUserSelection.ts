import { useState } from 'react';
import { User } from '@/types/user';

export function useUserSelection() {
  const [selection, setSelection] = useState<User[]>([]);

  const clearSelection = () => setSelection([]);

  return { selection, setSelection, clearSelection };
}
