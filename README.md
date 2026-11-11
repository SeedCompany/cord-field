# CORD Field

This is the UI for the CORD Field application.  
The API is [here](https://github.com/SeedCompany/cord-api-v3).

## Pre-requisites

You can see the complete setup guide for your local environment in the [cord-docs wiki](https://github.com/SeedCompany/cord-docs/wiki#new-hire-on-boarding).

_Note_: Current version of nodejs or at least the LTS version is recommended. If you run in to a compilation with the node server error where the Buffer object does not have a 'blob' property, this is likely the issue. You can check your node version by running `node -v`

## Local Development

1. `yarn install`
2. Ensure local API is running (see below)
3. `yarn gql-gen` to generate schema files from API & operations
4. `yarn start` to run the web server for development

### Connecting to the API Server

By default, this project will attempt to access the [cord api project](https://github.com/SeedCompany/cord-api-v3) that's running locally on your machine on port `3000`.

If you'd like to change the API server that you're connected to, create an `.env.local` file with the following contents:

```dotenv
RAZZLE_API_BASE_URL=http://your-api-server-host.com:3000
```

## Deploying a PR to the Dev environment

The shared Dev environment (https://dev.cordfield.com) can run the UI from a
specific PR instead of `develop`, so you can test a branch — including long-lived
ones — on real infra.

**To use it:** add the `dev-deploy` label to your PR.

- The PR's code deploys to Dev within a few minutes; deploy status shows on the
  PR's checks.
- Push more commits to that PR and Dev redeploys automatically.
- Only one PR holds Dev at a time. If another PR already has it, adding the label
  is declined — the label is removed and a comment tells you which PR to free up
  first.
- Remove the label, or merge/close the PR, to release your hold. Dev keeps
  running that last deploy until someone else grabs it (it does not revert to
  `develop` on its own).

The API side works the same way in
[cord-api-v3](https://github.com/SeedCompany/cord-api-v3); label the matching API
PR too when a change spans both.

**How it works:** a machine-owned pointer branch,
`deployment/dev-environment-pipeline`, always points at whatever is currently
deployed to Dev. The [`dev-deploy` workflow](.github/workflows/dev-deploy.yml)
moves that pointer to your PR's head commit when the label is added (or when a
labeled PR gets new commits). The AWS pipeline — configured in the infra repo at
`src/stacks/cord-v3.ts` (the `Cord-Dev` stack) — watches that branch and builds
and deploys whatever it points at.

A couple of notes:

- Don't push to `deployment/dev-environment-pipeline` by hand. It's managed by
  the workflow, and because it has no branch protection a manual push would also
  deploy.
- PRs from forks aren't supported (their commits aren't in this repo); the
  workflow removes the label and comments if you try.
