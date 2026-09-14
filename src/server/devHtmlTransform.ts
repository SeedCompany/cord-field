/**
 * The seam between the Vite dev server and the SSR renderer.
 *
 * `renderServerSideApp` has to hand its HTML to `vite.transformIndexHtml` in
 * dev — that call is what injects `/@vite/client` and, critically,
 * `@vitejs/plugin-react`'s React Refresh preamble. Without it Fast Refresh is
 * dead.
 *
 * It cannot `import` Vite to get there. `src/` is compiled into the production
 * server bundle, where Vite is a devDependency that does not exist, so a
 * static import would break the prod build outright. Nor can this be gated on
 * `import.meta.env.DEV`: the server bundle is emitted as CommonJS, where
 * `import.meta` is not available.
 *
 * So the dev server *pushes* its transform in here, through a
 * `Symbol.for`-keyed global. `Symbol.for` matters: `vite/plugins/devSsr.ts`
 * runs in the config's module graph while this file runs in Vite's SSR module
 * graph, so the two never share a module instance — only the global symbol
 * registry is common ground. The string key is duplicated there deliberately;
 * it is the contract.
 *
 * In production nothing ever calls the setter, `current` stays undefined, and
 * `transformDevHtml` is an identity function.
 */
type HtmlTransform = (url: string, html: string) => Promise<string>;

const KEY = Symbol.for('cord-field.devHtmlTransform');

const slot = globalThis as typeof globalThis & {
  [KEY]?: HtmlTransform;
};

/** Called once by the dev server plugin at startup. */
export const setDevHtmlTransform = (transform: HtmlTransform) => {
  slot[KEY] = transform;
};

/**
 * Runs the dev server's `transformIndexHtml` over `html`, or returns it
 * unchanged when there is no dev server (i.e. production).
 */
export const transformDevHtml = async (url: string, html: string) => {
  const transform = slot[KEY];
  return transform ? await transform(url, html) : html;
};
