import type { Connect, Plugin, ViteDevServer } from 'vite';

/** The Express factory in `src/server/server.ts`, as the SSR graph exports it. */
interface ServerModule {
  create: () => Promise<Connect.NextHandleFunction>;
}

/** Root-relative so Vite resolves it through the same graph as the app. */
const SERVER_ENTRY = '/src/server/server.ts';

/**
 * Must match `src/server/devHtmlTransform.ts`. Two module graphs, one global
 * symbol registry — see the comment there.
 */
const HTML_TRANSFORM_KEY = Symbol.for('cord-field.devHtmlTransform');

/**
 * Serves SSR in dev by mounting the Express app inside Vite's own connect
 * stack.
 *
 * This replaced the whole two-port dance in the old `razzle.config.js`:
 * webpack-dev-server owning `PORT`, a catch-all proxy to Express on `PORT+1`,
 * and a monkey-patch on `http-proxy-middleware`'s logger to hide the
 * confusing startup line that resulted. One process, one port, no proxy.
 *
 * Note this is a `configureServer` plugin rather than
 * `server.middlewareMode` + a hand-written `http.createServer`. Both put
 * Express in the same place in the same connect stack, but `middlewareMode`
 * makes `server.listen()` throw ("Cannot call server.listen in middleware
 * mode"), so it also requires a bespoke entry script to own the socket —
 * which means `vite` itself could no longer serve the app. Letting Vite own
 * the HTTP server keeps the dev command a plain `vite`.
 */
export const devSsr = (): Plugin => ({
  name: 'cord-field:dev-ssr',
  // Dev only. There is no `configureServer` during `vite build` anyway, but
  // being explicit keeps the preview server out of it too.
  apply: 'serve',

  configureServer(vite: ViteDevServer) {
    // `transformIndexHtml` accepts any HTML string; it does not need a file on
    // disk, which is the only reason this app — whose HTML is a template
    // literal in `src/server/indexHtml.ts` — can use it at all.
    (globalThis as any)[HTML_TRANSFORM_KEY] = (url: string, html: string) =>
      vite.transformIndexHtml(url, html);

    // Returning a function defers our middleware until *after* Vite's own:
    // module transforms, `/@vite/client`, `/@fs`, `publicDir` static files
    // and the HMR websocket. That ordering is why `express.static(PUBLIC_DIR)`
    // in `src/server/server.ts` never fires in dev — Vite has already served
    // `public/` — and therefore why its `__dirname`-based path only has to be
    // right in production.
    return () => {
      vite.middlewares.use((req, res, next) => {
        // Load the server module *per request*. `ssrLoadModule` consults
        // Vite's SSR module graph, which on a file change invalidates the
        // changed module and all of its importers, so the next request
        // re-executes exactly what changed.
        //
        // This is strictly better than the `module.hot.accept('./server/server')`
        // it replaces: that watched only `server.ts` itself, so editing
        // anything *underneath* it — any component that affects SSR markup —
        // silently served stale code.
        //
        // Re-calling `create()` each time is just Express router wiring, and
        // buys guaranteed freshness. Memoize on the module-graph epoch only
        // if it ever shows up in a profile.
        vite
          .ssrLoadModule(SERVER_ENTRY)
          .then((mod) => (mod as unknown as ServerModule).create())
          .then((app) => app(req, res, next))
          .catch((e: unknown) => {
            if (e instanceof Error) {
              // Maps the stack back through the SSR transform, so traces
              // point at `src/…` rather than at transformed output.
              vite.ssrFixStacktrace(e);
            }
            next(e);
          });
      });
    };
  },
});
