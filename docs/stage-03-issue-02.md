---
title: 'Serve SSR through Vite in middleware mode'
stage: 3
issue: 2
status: done
type: feature
depends_on: [stage-03-issue-01]
---

# Serve SSR through Vite in middleware mode

## Context

Today's dev topology, from [`razzle.config.js`](../razzle.config.js):
webpack-dev-server owns `PORT` (3001) → catch-all proxy (`context: () => true`)
→ Express on `PORT+1`. Two compilers, two servers, a proxy, and a monkey-patch on
`http-proxy-middleware`'s logger to suppress a confusing startup message.

**All of it collapses.** Vite in middleware mode runs one process on one port,
with the Express app mounted inside Vite's connect stack.

## Task

Add a local plugin, e.g. `vite/plugins/devSsr.ts`, that mounts the app:

```ts
configureServer(vite) {
  // Returning a function defers our middleware until AFTER Vite's own
  // (transform, /@vite/client, /@fs, publicDir static, HMR ws).
  return () => {
    vite.middlewares.use(async (req, res, next) => {
      try {
        const { create } = await vite.ssrLoadModule('/src/server/server.ts');
        const app = await create();
        app(req, res, next);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  };
}
```

Config: `server: { middlewareMode: true }`, `appType: 'custom'`,
`server.port = Number(process.env.PORT) || 3001`, `strictPort: true`.

### Server HMR replaces `module.hot`

`ssrLoadModule` consults Vite's SSR module graph, which invalidates changed
modules *and their importers* on file change — so the next request re-executes
only what changed. Delete the `module.hot.accept('./server/server', ...)` block
from [`src/index.ts`](../src/index.ts) entirely.

This is strictly better than what exists. Today's `module.hot.accept` watches
only `./server/server` itself, so changing anything *underneath* it — a deep
component that affects SSR markup — silently serves stale code. That blind spot
goes away.

Calling `create()` per request is cheap (it is just Express router wiring) and
guarantees freshness. Memoize on the module-graph epoch only if it ever shows up
in a profile.

### `transformIndexHtml` is not optional

In the dev branch of `renderServerSideApp`, pass the generated HTML through Vite:

```ts
html = await vite.transformIndexHtml(req.originalUrl, html);
```

It accepts any HTML string — it does not need a file on disk. It injects
`/@vite/client` and, critically, `@vitejs/plugin-react`'s React Refresh preamble.
**Without this call Fast Refresh is dead.**

Thread the `vite` server instance to `renderServerSideApp` without importing Vite
from app code — attach it to the request in the plugin, or use a `globalThis`
symbol gated on `import.meta.env.DEV` so it tree-shakes out of prod.

### Also delete

- `SERVER_PORT` from [`src/index.ts`](../src/index.ts) and the port-inversion
  block in `razzle.config.js`.
- `http-proxy-middleware` from [`package.json`](../package.json), and the
  `proxyLogger` monkey-patch.
- `@types/webpack-env` and `@types/webpack` (the `module.hot` typings).

`src/index.ts` becomes **production-only** — its `express().listen()` +
`createTerminus` path never runs in dev. Keep `createTerminus` for prod.

`express.static(PUBLIC_DIR)` is inert in dev: Vite's `publicDir` middleware serves
[`public/`](../public) before our middleware runs. That's why the `__dirname`-based
`PUBLIC_DIR` in [`src/server/server.ts`](../src/server/server.ts) only has to be
correct in production.

## Definition of done

- `yarn vite` serves the app and **binds exactly one port** — `lsof -i :3002` is
  empty.
- `curl -s localhost:3001/ | grep '@vite/client'` — `transformIndexHtml` ran.
- `curl -s localhost:3001/ | grep '@react-refresh'` — the preamble is present.
- `curl -s localhost:3001/ | grep -o 'window.env = {[^}]*}'` — runtime env present
  and populated (proves `loadDotenv` is wired).
- `curl -sI localhost:3001/images/cord-icon.png` → 200.
- **Editing `src/server/server.ts`** (add a header) changes behavior on reload
  without a restart.
- **Editing a deep component** (`src/components/Nest.tsx`) changes SSR markup —
  the case today's setup gets wrong.
- Fast Refresh preserves component state on edit.
