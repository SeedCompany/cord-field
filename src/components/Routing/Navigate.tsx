import type { To } from 'history';
import * as React from 'react';
import { createContext, ReactElement, useContext } from 'react';
import type { NavigateFunction, NavigateProps } from 'react-router';
import {
  Navigate as ClientNavigate,
  useNavigate as useClientNavigate,
} from 'react-router-dom';

const useServerNavigate = (): NavigateFunction => {
  const serverLocation = useContext(ServerLocationContext);
  if (!serverLocation) {
    throw new Error('Server location context should be provided for SSR');
  }
  return (
    to: To | number,
    _options?: { replace?: boolean; state?: unknown }
  ) => {
    if (typeof to === 'number') {
      throw new Error('Navigate with delta is not supported with SSR');
    }
    if (typeof to !== 'string') {
      throw new Error('Navigate with partial paths are not yet implemented');
    }
    serverLocation.url = to;
  };
};

const ServerNavigate = ({ to, ...options }: NavigateProps) => {
  const navigate = useServerNavigate();
  navigate(to, options);

  return null;
};

export const Navigate =
  typeof window === 'undefined' ? ServerNavigate : ClientNavigate;

export const useNavigate =
  typeof window === 'undefined' ? useServerNavigate : useClientNavigate;

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
