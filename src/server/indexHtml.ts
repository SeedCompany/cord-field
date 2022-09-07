import { ChunkExtractor } from '@loadable/server';
import { HelmetServerState as HelmetData } from 'react-helmet-async';
import { trailingSlash } from '~/common';

export const indexHtml = ({
  helmet,
  markup,
  extractor,
  emotion,
  globals,
}: {
  helmet: HelmetData;
  markup: string;
  extractor: ChunkExtractor;
  emotion: string;
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
  ${emotion}
  ${helmet.noscript.toString()}
  ${helmet.script.toString()}
</head>
<body ${helmet.bodyAttributes.toString()}>
  <div id="root">${markup}</div>
  <script>
${Object.entries(globals)
  .map(
    ([key, value]) =>
      `window.${key} = ${JSON.stringify(value).replace(/</g, '\\u003c')};`
  )
  .join('\n')}
  </script>
  ${extractor.getScriptTags()}
</body>
</html>
`;
