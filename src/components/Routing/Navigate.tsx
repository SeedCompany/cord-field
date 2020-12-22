import * as React from 'react';
import { createContext, ReactElement, useContext } from 'react';
import type { NavigateProps } from 'react-router';
import { Navigate as ClientNavigate } from 'react-router-dom';

const ServerNavigate = (props: NavigateProps) => {
  const serverLocation = useContext(ServerLocationContext);
  if (!serverLocation) {
    throw new Error('Server location context should be provided for SSR');
  }
  if (typeof props.to === 'string') {
    serverLocation.url = props.to;
  } else {
    throw new Error('Navigate with partial paths are not yet implemented');
  }

  return null;
};

export const Navigate =
  typeof window === 'undefined' ? ServerNavigate : ClientNavigate;

interface ServerLocationContextType {
  url?: string;
  statusCode?: number;
}

const ServerLocationContext = createContext<
  ServerLocationContextType | undefined
>(undefined);

export class ServerLocation {
  private context?: ServerLocationContextType;
  wrap(el: ReactElement) {
    this.context = {};
    return (
      <ServerLocationContext.Provider value={this.context}>
        {el}
      </ServerLocationContext.Provider>
    );
  }
  get url() {
    return this.getContext().url;
  }
  get statusCode() {
    return this.getContext().statusCode;
  }
  getContext() {
    if (!this.context) {
      throw new Error('ServerLocation.wrap must be used when rendering');
    }
    return this.context;
  }
}
