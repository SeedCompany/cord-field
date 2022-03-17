import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import { pickBy } from 'lodash';
import { HelmetServerState as HelmetData } from 'react-helmet-async';
import { ErrorCache } from '../api/links/errorCache.link';
import { ServerData } from '../components/ServerData';
import { trailingSlash } from '../util';

export const indexHtml = ({
  helmet,
  serverData,
  markup,
  extractor,
  sheets,
  apolloCache,
  errorCache,
}: {
  helmet: HelmetData;
  serverData: ServerData;
  markup: string;
  extractor: ChunkExtractor;
  sheets: ServerStyleSheets;
  apolloCache: unknown;
  errorCache: ErrorCache;
}) => `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
<head>
  <base href="${trailingSlash(process.env.PUBLIC_URL)}">
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  ${extractor.getLinkTags()}
  ${helmet.link.toString()}
  ${extractor.getStyleTags()}
  ${helmet.style.toString()}
  <style id="jss-ssr">${sheets.toString()}</style>
  ${helmet.noscript.toString()}
  ${helmet.script.toString()}
</head>
<body ${helmet.bodyAttributes.toString()}>
  <div id="root">${markup}</div>
  <script>
    window.env = ${JSON.stringify(clientEnv)};
    window.__SERVER_DATA__ = ${JSON.stringify(serverData)};
    window.__APOLLO_STATE__ = ${JSON.stringify(apolloCache).replace(
      /</g,
      '\\u003c'
    )};
    window.__APOLLO_ERRORS__ = ${JSON.stringify(errorCache)};
  </script>
  ${extractor.getScriptTags()}
</body>
</html>
`;

const clientEnv: NodeJS.ProcessEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_URL: trailingSlash(process.env.PUBLIC_URL),
  VERSION: process.env.VERSION,
  ...pickBy(process.env, (val, key) => key.startsWith('RAZZLE_')),
};
