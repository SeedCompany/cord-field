# E2E Tests

Playwright tests live under this folder and are intended to validate user-facing flows against the current GraphQL API.

## Commands

```bash
yarn test:e2e:install
yarn test:e2e
yarn test:e2e:headed
yarn test:e2e:report
```

By default, Playwright targets `http://localhost:3000` and starts `yarn start` if no local server is already running.

## Environment Targets

Use `PLAYWRIGHT_BASE_URL` to run the same suite against migration environments.

```bash
PLAYWRIGHT_BASE_URL=https://neo4j.example.test PLAYWRIGHT_SKIP_WEB_SERVER=true yarn test:e2e
PLAYWRIGHT_BASE_URL=https://postgres.example.test PLAYWRIGHT_SKIP_WEB_SERVER=true yarn test:e2e
```

## Authenticated Tests

Do not commit credentials. Authenticated tests should read credentials from environment variables:

```bash
PLAYWRIGHT_USER_EMAIL=user@example.com PLAYWRIGHT_USER_PASSWORD=secret yarn test:e2e
```

Prefer seeded users and seeded records so tests are deterministic across Neo4j and Postgres runs.