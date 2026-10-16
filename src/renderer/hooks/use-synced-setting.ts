import { useState } from 'react';

export function useSyncedSetting<T>(initialValue: T, save: (value: T) => Promise<T>) {
  const [value, setValue] = useState(initialValue);

  const change = async (next: T) => {
    const previous = value;

    setValue(next);

    try {
      setValue(await save(next));
    } catch {
      setValue(previous);
    }
  };

  return [value, change] as const;
}
