import { HelmetServerState as HelmetData } from 'react-helmet-async';
import { trailingSlash } from '~/common';
import { RenderedAssets } from './assets';

export const indexHtml = ({
  helmet,
  markup,
  assets,
  emotion,
  globals,
}: {
  helmet: HelmetData;
  markup: string;
  assets: RenderedAssets;
  emotion: string;
  globals: Record<string, any>;
}) => `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
<head>
  <base href="${trailingSlash(process.env.PUBLIC_URL)}">
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  ${assets.links}
  ${helmet.link.toString()}
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
  ${assets.scripts}
</body>
</html>
`;
