import { ChunkExtractor } from '@loadable/server';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';
import { HelmetServerState as HelmetData } from 'react-helmet-async';
import { trailingSlash } from '../util';

export const indexHtml = ({
  helmet,
  markup,
  extractor,
  sheets,
  globals,
}: {
  helmet: HelmetData;
  markup: string;
  extractor: ChunkExtractor;
  sheets: ServerStyleSheets;
  globals: Record<string, any>;
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
    ${Object.entries(globals).map(
      ([key, value]) =>
        `window.${key} = ${JSON.stringify(value).replace(/</g, '\\u003c')}`
    )}
  </script>
  ${extractor.getScriptTags()}
</body>
</html>
`;
