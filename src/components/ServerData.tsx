import { Request } from 'express';
import React, { createContext, FC, useContext, useMemo } from 'react';
import { Promisable } from 'type-fest';

export type ServerData = any;

export type FetchDataFn = (req: Request) => Promisable<Partial<ServerData>>;

const ServerDataContext =
  createContext<{ data: ServerData } | undefined>(undefined);

export const ServerDataProvider: FC<{ value: ServerData }> = (props) => {
  const value = useMemo(
    () => ({
      data: props.value,
    }),
    [props.value]
  );

  return (
    <ServerDataContext.Provider value={value}>
      {props.children}
    </ServerDataContext.Provider>
  );
};

export const useServerData = () => {
  const context = useContext(ServerDataContext);
  if (!context) {
    throw new Error('useServerData() must be a child of <ServerDataProvider>');
  }
  return context.data;
};
