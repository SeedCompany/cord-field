---
title: 'Switch Yarn to the node-modules linker'
stage: 1
issue: 3
status: open
type: chore
---

# Switch Yarn to the node-modules linker

## Context

The repo uses Yarn 4 in **PnP mode** (`.pnp.cjs` is committed, and
[`.yarnrc.yml`](../.yarnrc.yml) sets no `nodeLinker`, so PnP is the default).

Vite and Yarn PnP have a long, unresolved history of friction. The structural
reason: Vite's dependency pre-bundler shells out to **esbuild, a Go binary that
reads the filesystem directly**, while PnP works by monkey-patching Node's `fs` —
a Go process gets none of that. Vite routes some resolution through JS plugins,
which is why it sometimes works, but the dependency scanner and any native
resolution path stay exposed. Vite 8's Rust resolver cannot read PnP zips at all.

Doing this **now, under Razzle**, is deliberate: it isolates this change's failure
modes from Vite's entirely. If something breaks, there is exactly one suspect.

This also unlocks a pin we have been carrying for unrelated reasons — see below.

## Task

Set the linker:

```yaml
# .yarnrc.yml
nodeLinker: node-modules
```

Then work the cascade:

| File | Change |
| --- | --- |
| `.pnp.cjs`, `.pnp.loader.mjs` | `git rm` — no longer generated |
| [`.gitignore`](../.gitignore) | the `.pnp.*` entry becomes dead; `node_modules` is already ignored |
| `.yarn/sdks/` | delete — editors resolve `typescript`/`eslint`/`prettier` from `node_modules` natively |
| [`.vscode/settings.json`](../.vscode/settings.json) | drop `eslint.nodePath`, `prettier.prettierPath`, `typescript.tsdk`, and the workspace-TSDK prompt; keep the `**/.yarn` search exclusion |
| [`Dockerfile`](../Dockerfile) | `COPY --from=builder /app/.pnp.* ./` **will hard-fail** once no such files exist — replace with `COPY --from=builder /app/node_modules ./node_modules` |
| [`.nvmrc`](../.nvmrc), [`Dockerfile`](../Dockerfile), [`.github/actions/setup/action.yml`](../.github/actions/setup/action.yml) | **un-pin Node from 24.14.1** |

### The Node pin

The 24.14.1 pin exists *solely* because Node 24.15+ triggers an `EBADF` bug in
Yarn PnP's CJS-from-zip loader. No PnP means no zip loader, which means the pin
has no remaining justification. Move to `24.x`.

### What keeps working

The 8 entries in `.yarn/patches` and all the `packageExtensions` in
[`.yarnrc.yml`](../.yarnrc.yml) work unchanged under the node-modules linker —
patches are not a PnP feature. `yarn workspaces focus --all --production` also
still prunes correctly.

## Trade-off being accepted

Installs get slower and `node_modules` returns to disk. That is the known cost,
accepted deliberately in exchange for removing an unbounded unknown from the
migration and unblocking the Node version.

## Definition of done

- `rm -rf node_modules .pnp.* && yarn install --immutable` succeeds.
- `yarn type-check && yarn lint:check && yarn test && yarn build` green under
  Razzle.
- `docker build` succeeds and `docker run` serves the app.
- `docker run --rm <image> sh -c 'ls node_modules | wc -l'` confirms the
  production prune actually happened (it should be far smaller than the builder
  stage).
- Editor integration (ESLint, Prettier, TS) still works without the SDKs.
