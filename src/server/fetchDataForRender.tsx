import { Request } from 'express';
import React, { ComponentType, ReactElement } from 'react';
import ssrPrepass from 'react-ssr-prepass';
import { FetchDataFn, ServerData } from '../components/ServerData';

export const fetchDataForRender = async (
  App: ComponentType<{ data: ServerData; req: Request }>,
  req: Request
) => {
  const serverData: ServerData = {};

  await ssrPrepass(
    <App data={serverData} req={req} />,
    async (element, _instance) => {
      if (!isElement(element)) {
        return;
      }
      if (!element.type.fetchData) {
        return;
      }
      const data = await element.type.fetchData(req);
      for (const key of Object.keys(data)) {
        if (serverData[key]) {
          const component =
            element.type.name ?? element.type.constructor.name ?? 'Unknown';
          throw new Error(
            `<${component}> is overwriting an existing server data value for "${key}".`
          );
        }
      }
      Object.assign(serverData, data);
    }
  );

  return serverData;
};

const isElement = (
  el: unknown
): el is ReactElement<any, ComponentType & { fetchData?: FetchDataFn }> =>
  el && typeof el === 'object' && typeof (el as any).type === 'function';
