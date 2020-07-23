import React, { createContext, FC, useContext, useState } from 'react';

interface PreviewContextValue {
  error: string;
  setError: (message: string) => void;
}

export const PreviewContext = createContext<PreviewContextValue>({
  error: '',
  setError: () => null,
});

export const PreviewContextProvider: FC = ({ children }) => {
  const [error, setError] = useState('');

  return (
    <PreviewContext.Provider value={{ error, setError }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);
