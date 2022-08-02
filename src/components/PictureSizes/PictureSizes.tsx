import { createContext, ReactNode, useContext, useDebugValue } from 'react';

const PictureSizesContext = createContext('100vw');

export interface PictureSizesProviderProps {
  /** Give raw sizes value */
  sizes: string;
  children: ReactNode;
}

export const PictureSizesProvider = ({
  sizes,
  children,
}: PictureSizesProviderProps) => (
  <PictureSizesContext.Provider value={sizes}>
    {children}
  </PictureSizesContext.Provider>
);

export const usePictureSizes = () => {
  const sizes = useContext(PictureSizesContext);
  useDebugValue(sizes);
  return sizes;
};
