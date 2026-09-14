---
title: 'Cut scripts, CI and the Dockerfile over to Vite'
stage: 4
issue: 1
status: open
type: chore
depends_on: [stage-03-issue-02, stage-03-issue-03]
---

# Cut scripts, CI and the Dockerfile over to Vite

## Context

This is the cutover. Everything moves **in one commit** so the deployable image is
never half-migrated.

## Task

### `package.json`

```diff
-"start:server": "razzle start",
+"start:server": "vite",
-"build": "yarn gql-gen && razzle build --noninteractive",
+"build": "yarn gql-gen && rimraf build && yarn build:client && yarn build:server",
```

### `.github/workflows/ci.yml`

```diff
-      - name: Build
-        run: yarn razzle build
+      - name: Build
+        run: yarn build
```

### `Dockerfile`

```diff
-RUN yarn gql-gen -e && yarn razzle build --noninteractive
+RUN yarn gql-gen -e && yarn build
```

## Two traps to handle in this commit

### 1. CI builds in development mode

[`ci.yml`](../.github/workflows/ci.yml) sets `NODE_ENV: development` at the
workflow level. **`razzle build` forced production regardless; `vite build` will
not.** Left alone, CI would produce and validate a development bundle.

Either force the mode in the build script or override `NODE_ENV` for the build
step. Verify by grepping the built client for `"development"`.

### 2. `RAZZLE_GIT_HASH` is already broken in production

The Dockerfile ends with:

```dockerfile
RUN echo RAZZLE_GIT_HASH=$GIT_HASH >> .env
RUN echo RAZZLE_GIT_BRANCH=$GIT_BRANCH >> .env
```

Nothing reads `/app/.env` at runtime — `setupEnvironment` is CLI-only, invoked by
the Razzle CLI and by the codegen hook, neither of which runs in the container. So
`RAZZLE_GIT_HASH` is **`undefined` in production today**, and
[`createClient.ts:32`](../src/api/client/createClient.ts#L32) sends no version in
`clientAwareness`.

Replace with real env:

```dockerfile
ENV RAZZLE_GIT_HASH=$GIT_HASH
ENV RAZZLE_GIT_BRANCH=$GIT_BRANCH
```

This is a pre-existing bug, fixed opportunistically because the migration touches
these exact lines. Worth calling out in the PR description so it isn't mistaken
for a regression in the other direction.

## Definition of done

- CI green end to end.
- The built client does **not** contain `"development"` as its mode.
- `docker build` succeeds; `docker run -p 8080:80 -e PUBLIC_URL=http://localhost:8080`
  serves the app.
- `curl -s localhost:8080/ | grep RAZZLE_GIT_HASH` shows the real hash — today it
  does not.
- `curl -sI localhost:8080/health` → 200 (terminus still wired).
- `curl -sI localhost:8080/static/nope.js` → 404, not an HTML page.
- **Build once, run twice** with different `RAZZLE_API_BASE_URL` and `PUBLIC_URL`
  and confirm both take effect with no rebuild. This is the property most likely
  to regress silently.
