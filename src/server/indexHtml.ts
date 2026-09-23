import { HelmetServerState as HelmetData } from 'react-helmet-async';
import { trailingSlash } from '~/common';
import { RenderedAssets } from './assets';

/**
 * Resolves a built asset's path against the deployment's `PUBLIC_URL`, at
 * runtime in the browser.
 *
 * This is what `vite.config.ts`'s `experimental.renderBuiltUrl` emits at every
 * asset reference, replacing webpack's `DynamicPublicPathPlugin`. It is a
 * helper rather than an inlined concatenation so that `PUBLIC_URL`
 * normalisation has one home: `window.env.PUBLIC_URL` is already put through
 * `trailingSlash` by `renderServerSideApp`'s `clientEnv`, so this only has to
 * join.
 */
const assetUrlHelper = `    window.__assetUrl = function (path) {
      return ((window.env && window.env.PUBLIC_URL) || '/') + String(path).replace(/^\\/+/, '');
    };`;

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
${assetUrlHelper}
  </script>
  ${assets.scripts}
</body>
</html>
`;
