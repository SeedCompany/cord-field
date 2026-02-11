# MCP Server Configuration — SeedCompany/cord-field

This document provides the exact `mcpServers` JSON configuration block for connecting
the MCP Servers to the `cord-field` development environment.

## Overview

This repository documents two MCP server endpoints used by agents:

- **GitHub MCP**: provides access to GitHub resources (issues, pull requests, file
  contents, code search) and is the primary tool for interacting with repository
  data and creating PRs/issues where permitted.
- **GraphQL MCP (`cord_api`)**: an HTTP MCP entry that points at the CORD API
  GraphQL endpoint and is used for schema introspection, operation queries, and
  codegen-related reads.

The GitHub MCP Server grants structured access to GitHub resources within a tightly
scoped set of repositories. The combination of the two MCP endpoints enables agents
to both read repository source and also query the live GraphQL schema when necessary.
This configuration restricts agent access to **only** the permitted repositories in
the SeedCompany poly-repo architecture.

## Scoped Repositories

| Repository | Access Level | Purpose |
|---|---|---|
| `SeedCompany/cord-field` | **Read + Write** | Primary working repository (frontend) |
| `SeedCompany/cord-api-v3` | **Read-only** | GraphQL API contracts, DTOs, EdgeDB schema |

### Explicitly Blocked Repositories
The following repositories are **BLOCKED** and must never be accessed:
- `SeedCompany/seed-api` — Off-limits; do not query or reference
- `SeedCompany/libs` — Consume via npm only (immutable monorepo)
- `SeedCompany/infra` — AWS CDK / CI/CD; off-limits to application agents
- `SeedCompany/investor-portal` — Separate frontend; outside scope
- `SeedCompany/cord-api` (v1/v2) — Legacy; do not access
- All other `SeedCompany/*` repositories — Not in scope
- All external repositories — No org-level wildcard access

## VS Code `settings.json` Configuration

This repo includes a machine-readable example you can copy/paste: `.github/mcp-servers.example.json`.

What to copy/paste
- Copy the entire contents of `.github/mcp-servers.example.json` when your MCP client or
  VS Code `settings.json` asks for an `mcpServers` block. Replace the placeholder inputs
  (`${input:github_token}`, `${input:graphql_url}`, `${input:graphql_token}`) with secret inputs
  or environment-specific values per your deployment.

Quick VS Code example (user/workspace `settings.json`):

```jsonc
{
  "mcp": {
    "servers": {
      // paste the contents of .github/mcp-servers.example.json here
    }
  }
}
```

Notes:
- `writeScopes` marks allowed write targets (issues/PRs). `cord-api-v3` is intentionally not in `writeScopes`.
- The MCP server implementation may ignore `writeScopes`; enforce write limitations via agent instructions and repository branch-protection.

          ## Agent Toolset Usage (examples)

          Use these calls to fetch API contracts or project files prior to generating mocks.

          ```text
          # Read a DTO from cord-api-v3 (read-only)
          files.get_contents("SeedCompany/cord-api-v3", "src/components/project/dto/project.dto.ts")

          # Read EdgeDB schema (read-only)
          files.get_contents("SeedCompany/cord-api-v3", "dbschema/engagement.gel")

          # Read a file from cord-field
          files.get_contents("SeedCompany/cord-field", "src/scenes/Projects/List/ProjectList.tsx")

          # Search for DTOs
          code_search.search("repo:SeedCompany/cord-api-v3 path:dto filename:*.dto.ts")

          # List open issues in cord-field
          issues.list("SeedCompany/cord-field", state=\"open\")

          # Create a PR in cord-field (agent must only create PRs in cord-field)
          pull_requests.create("SeedCompany/cord-field", title=\"<title>\", head=\"feature-branch\", base=\"develop\")
          ```

          ## Explicitly Blocked Repositories
          The following repositories are **BLOCKED** and must never be accessed by the agent:
          - `SeedCompany/seed-api` — Off-limits; do not query or reference
          - `SeedCompany/libs` — Immutable monorepo. Consume via npm only
          - `SeedCompany/infra` — AWS CDK / CI/CD; off-limits to application agents
          - `SeedCompany/investor-portal` — Separate frontend; outside scope
          - `SeedCompany/cord-api` (v1/v2) — Legacy; do not access
          - All other `SeedCompany/*` repositories — Not in scope
          - All external repositories — No org-level wildcard access

          ## Isolation Guarantee

          This configuration enforces **hard isolation** to exactly two repositories:

          1. **Allowlist (two repos only)** — Every toolset scope contains ONLY `SeedCompany/cord-field` and `SeedCompany/cord-api-v3`. No other repos are in any scope.
          2. **No wildcard access** — The agent cannot query `SeedCompany/*`, `github.com/*`, or any org-level resource patterns.
          3. **All other SeedCompany repos blocked** — `seed-api`, `libs`, `infra`, `investor-portal`, legacy APIs, and any future org repos are unreachable.
          4. **External repos blocked** — No access to any repository outside SeedCompany.
          5. **Write operations confined** — The agent can only create/modify PRs and issues in `cord-field`. `cord-api-v3` is strictly read-only (enforced via branch protection).

        ## Secrets and External Endpoints

        Do not commit real credentials into the repository. Use workspace/user secrets, a Vault, or a GitHub App installation token stored as a secret. Below are recommended placeholder inputs and an example `mcpServers` snippet showing how to reference them.

        Recommended input/secret names (safe to reference in this file):
        - `github_token` (or `GITHUB_MCP_TOKEN`) — GitHub App installation token or minimally-scoped PAT for MCP use
        - `graphql_url` (or `CORD_API_GQL_URL`) — CORD API GraphQL endpoint (e.g., `http://localhost:3000/graphql` for local dev)
        - `graphql_token` (or `CORD_API_GQL_TOKEN`) — Optional API token if the GraphQL endpoint requires auth

        Example (safe to commit, uses placeholders):

        ```json
        {
          "mcpServers": {
            "github": {
              "type": "http",
              "url": "https://api.githubcopilot.com/mcp/",
              "headers": {
                "Authorization": "Bearer ${input:github_token}"
              }
            },
            "cord_api": {
              "type": "http",
              "url": "${input:graphql_url}",
              "headers": {
                "Authorization": "Bearer ${input:graphql_token}"
              }
            }
          }
        }
        ```

        Notes and recommendations:
        - Prefer a **GitHub App** with an installation token for MCP access — create the App, grant only required scopes, and store the installation token as `github_token` in Secrets.
        - For local development, `graphql_url` can be `http://localhost:3000/graphql` (ensure the dev server is running before running `yarn gql-gen`).
        - In CI or deployed MCP environments, point `graphql_url` to the staging/production endpoint and provide `graphql_token` only if required by the endpoint's auth policy.
        - Never store long-lived org-level tokens in the repository. Use scoped secrets and rotate regularly.
