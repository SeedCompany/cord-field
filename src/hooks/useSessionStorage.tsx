import { useEffect, useState } from 'react';

export const useSessionStorage = <T,>(key: string, defaultValue: T) => {
  const storageKey = `${key}`;

  const getInitialValue = (): T => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) {
      return JSON.parse(sessionStorage.getItem(storageKey)!);
    }
    return defaultValue;
  };

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, JSON.stringify(storedValue));
    }
  }, [storageKey, storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue] as const;
};
