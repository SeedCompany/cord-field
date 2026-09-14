---
title: 'Spike: does Vite `define` rewrite the `process.env` member-chain prefix?'
stage: 0
issue: 1
status: done
type: spike
blocks: [stage-03-issue-01]
---

# Spike: `define: { 'process.env': 'window.env' }`

## Why this is first

The whole runtime-env system depends on one substitution that
[`razzle.config.js`](../razzle.config.js) gets from webpack's `DefinePlugin`:

```js
define('process.env', 'window.env');
```

This rewrites **every** client-side `process.env.FOO` read into `window.env.FOO`,
where `window.env` is an allowlisted object injected per request by
[`src/server/renderServerSideApp.tsx`](../src/server/renderServerSideApp.tsx).
That indirection is what lets one Docker image be built once and configured per
environment at container start.

Vite's `define` documentation says values must be "a JSON-serializable value or a
single identifier" and does not state whether a **dotted key** matches the prefix
of a longer member chain. esbuild supports this; recent Vite versions route
`define` through Oxc, whose docs only promise exact dotted-key matching. So the
behavior is genuinely unverified in both directions, and Stage 3 shouldn't be
designed around it until it is.

## Task

In a throwaway directory (not this repo), with Vite 7 and
`@vitejs/plugin-react@5`:

```ts
// vite.config.ts
define: { 'process.env': 'window.env' }
```

```ts
// src/main.ts
console.log(process.env.PUBLIC_URL);
console.log(process.env[`RAZZLE_POSTHOG_FLAG_${x}`]);
console.log(process.env.NODE_ENV);
```

Run **both** `vite build` and `vite dev` — Vite's dev and build define paths
differ, so a pass in one proves nothing about the other. Grep the output for:

1. `window.env.PUBLIC_URL` — the basic prefix rewrite.
2. `window.env[` — computed access still works. Two real call sites depend on
   this, both in [`src/components/Feature.tsx`](../src/components/Feature.tsx)
   (lines 16 and 56).
3. Whichever of `"production"` / `window.env.NODE_ENV` won for `NODE_ENV` — Vite
   injects its own `process.env.NODE_ENV` define, so two overlapping keys exist
   where one is a prefix of the other. Confirm the resolution order is sane.

All three must be right.

## Outcome

- **If it works**: Stage 3 uses `define` as planned, and no source changes are
  needed for the ~40 `process.env` reads.
- **If it doesn't**: fall back to an explicit accessor module
  (`src/common/env.ts`) exporting
  `typeof window !== 'undefined' && window.env ? window.env : process.env`, plus a
  codemod of the ~40 read sites. This has a real upside worth noting: the accessor
  **works identically under Razzle and Vite**, so it can land as its own Stage 1
  commit before Vite exists, and it makes the client/server split explicit rather
  than implicit in bundler config.

Record the answer in this file, and if the fallback is needed, create a new
`stage-01-issue-08.md` for the accessor codemod — it belongs in Stage 1 because,
unlike `define`, the accessor works under Razzle too and can land before Vite
exists. (That file does not exist yet, by design; it is only written if the spike
fails.)

## Definition of done

- The three greps above are answered for both `vite build` and `vite dev`.
- This file records the result and names the chosen path.
- `stage-03-issue-01.md`'s "Defines" section is updated to match the outcome.

---

## Result — the spike FAILED (dev does not rewrite the prefix)

Run on 2026-09-14 in a throwaway `npm` project with **Vite 7.3.6** and
**`@vitejs/plugin-react` 5.2.0**, `define: { 'process.env': 'window.env' }`,
`build.minify: false`, and exactly the `src/main.ts` above.

**`vite build` — all three correct.** Emitted chunk, verbatim:

```js
const x = "BETA";
console.log(window.env.PUBLIC_URL);
console.log(window.env[`RAZZLE_POSTHOG_FLAG_${x}`]);
console.log("production");
```

**`vite dev` — the prefix rewrite does not happen.** Transformed module served
at `/src/main.ts`, verbatim:

```js
const x = "BETA";
console.log(process.env.PUBLIC_URL);
console.log(process.env[`RAZZLE_POSTHOG_FLAG_${x}`]);
console.log("development");
```

| Grep | `vite build` | `vite dev` |
| --- | --- | --- |
| 1. `window.env.PUBLIC_URL` | present (1 hit) | **absent (0 hits)** — left as `process.env.PUBLIC_URL` |
| 2. `window.env[` | present (1 hit) | **absent (0 hits)** — left as `process.env[` |
| 3. `NODE_ENV` resolution | `"production"` — the exact key wins; no `window.env.NODE_ENV` | `"development"` — same, exact key wins |

So grep 3 is fine in both modes, and the resolution order is sane: Vite's own
exact `process.env.NODE_ENV` define takes precedence over the shorter
`process.env` prefix key rather than producing `window.env.NODE_ENV` or a
double substitution. But greps 1 and 2 pass **only** in the build.

This is the exact dev/build asymmetry the task anticipated. The build path still
runs `define` through a full-chain rewriter; the dev transform pipeline applies
only exact dotted-key matches. In dev the surviving `process.env.*` reads would
throw `ReferenceError: process is not defined` in the browser, so this is a hard
dev failure, not a cosmetic one — and precisely the kind of thing a green
production build would have hidden until someone ran `yarn dev`.

## Chosen path: the `src/common/env.ts` accessor

`define` is **not** viable for `process.env` as a member-chain prefix. Take the
documented fallback:

```ts
// src/common/env.ts
export const env =
  typeof window !== 'undefined' && window.env ? window.env : process.env;
```

plus a codemod of the client-side read sites. Tracked as
`stage-01-issue-08.md`, in Stage 1 — the accessor works identically under
Razzle and Vite, so it lands before Vite exists.

Exact-key defines are unaffected and stay as planned in `stage-03-issue-01.md`:
`'process.env.MUI_X_LICENSE_KEY'` and `__DEV__`. `NODE_ENV` needs nothing at
all — Vite defines it in both modes.
