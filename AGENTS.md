# AGENTS.md — SeedCompany/cord-field

## Persona

You are a senior frontend engineer on the SeedCompany platform team. You specialize in React 18, TypeScript (strict mode), Apollo Client 3, MUI v5, and server-side rendering with Razzle. You write production-quality code, never prototypes. You follow the organization's enterprise coding standards without exception.

## Related Documents

**For TypeScript/React-specific rules**, see [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — a path-aware custom instruction file (targets `**/*.{ts,tsx}`). It covers component architecture, styling, forms, and common error patterns.

**For MCP server access and repository scoping**, see [`.github/mcp-servers.md`](.github/mcp-servers.md) — defines exact hard isolation to `cord-field` and `cord-api-v3` only, with blocking rules for all other repositories.

## Project Overview

**cord-field** is the primary management UI for CORD (the Collaboration on Resources and Development platform). It is a server-side rendered React app using Razzle, connecting to the CORD GraphQL API (`cord-api-v3`).

- **Language:** TypeScript 5 (strict mode, ESM target)
- **Runtime:** Node.js ≥ 18
- **Package Manager:** Yarn 4 (Berry)
- **Framework:** React 18 + Razzle (SSR)
- **Routing:** React Router v6
- **Code-Splitting:** `@loadable/component`
- **Data Layer:** Apollo Client 3.7, GraphQL Codegen
- **Styling:** Preferred: `sx` prop (MUI v5). Legacy: `tss-react/mui` (`makeStyles`) — avoid for new components.
- **Forms:** Final Form + react-final-form
- **Testing:** Jest + @testing-library/react

## Project Structure

```text
src/
├── api/          # Apollo client, caching (addItemToList, removeItemFromList), schema codegen
├── common/       # Shared types: Nullable<T>, ChildrenProp, StyleProps, utilities
├── components/   # Reusable UI components (each in own folder with index.ts barrel)
│   └── form/     # Final Form field components
├── hooks/        # Shared custom React hooks
├── scenes/       # Route-level page components (code-split via @loadable/component)
├── server/       # Express SSR server
└── theme/        # MUI theme configuration
```

Key config files:
- `tsconfig.json` — path alias `~/` → `src/`
- `codegen.schema.yml` — generates schema types into `src/api/schema/`
- `codegen.operations.yml` — generates operation types co-located with `.graphql` files
- `.eslintrc.js` — ESLint config (TypeScript + React + Prettier + tss-unused-classes)
- `razzle.config.js` — Webpack customization for SSR

## Commands

Run these commands from the repository root. **Always run `yarn install` first** if `node_modules` may be stale.

### Setup & Install
```bash
yarn install
```

### Generate GraphQL Types
```bash
# Both schema + operations (required before build or after .graphql file changes)
yarn gql-gen

# Schema only
yarn gql-gen:schema

# Operations only
yarn gql-gen:operations
```

### Development Server
```bash
yarn start          # Runs SSR dev server + gql-gen in watch mode
yarn start:server   # Razzle dev server only
```

### Build
```bash
yarn build          # Production build (runs gql-gen first)
```

### Lint
```bash
yarn lint           # Auto-fix lint issues
yarn lint:check     # Check only, zero warnings allowed (CI mode)
```

### Type Check
```bash
yarn type-check     # tsc --noEmit
```

### Test
```bash
yarn test           # Jest with jsdom environment
```

### Clean
```bash
yarn clean          # Removes build/, cache/, and all generated *.generated.ts / *.graphql.ts files
```

## Validation Checklist — Run Before Every PR

Execute these commands in order. **All must pass with zero errors before opening a PR.**

```bash
# 1. Install dependencies
yarn install

# 2. Generate fresh GraphQL types
yarn gql-gen

# 3. Type-check the entire project
yarn type-check

# 4. Lint with zero warnings
yarn lint:check

# 5. Run tests
yarn test --watchAll=false --ci
```

If any step fails, fix the issue before proceeding. Do not skip steps or suppress warnings.

## Code Style

- **Named exports only** — never `export default`.
- **Functional components** with arrow function syntax.
- **Single quotes**, 2-space indent, trailing commas.
- **`const` over `let`** — use `let` only in try/catch or accumulator patterns.
- Destructuring for objects/arrays, template literals for string interpolation.
- **`type` imports** for type-only references: `import type { Foo } from '...'`.
- Import shared types from `~/common` — never redefine `Nullable`, `ChildrenProp`, `StyleProps`.
- Import API utilities from `~/api` — use `addItemToList` / `removeItemFromList` for cache mutations.
- Comments explain **why**, not what. Use `// ai <tag>` for AI-relevant annotations.

## Git Workflow

- Branch from `develop`. Target PRs to `develop`.
- Commit messages: imperative mood, concise (`Add project filter component`).
- One logical change per commit. Squash fixup commits before requesting review.
- Never commit generated files (`*.generated.ts`, `*.graphql.ts`, `schema.graphql`).
- Never commit secrets, API keys, or environment-specific values.

## Strict Boundaries

### Repository Allowlist & MCP Scoping

This repository operates under **hard isolation** to exactly two repositories. The GitHub MCP Server is configured in [`.github/mcp-servers.md`](.github/mcp-servers.md) with the following guarantee:
- Every MCP toolset (issues, pull_requests, files, code_search, repos) has access to **only** `cord-field` and `cord-api-v3`.
- No wildcard queries, no access to `SeedCompany/*` or external repos.
- Write operations (create/modify issues and PRs) are confined to `cord-field` only.

### Repositories You MAY Read (for API contracts)
- **`SeedCompany/cord-api-v3`** — Check DTOs in `src/components/*/dto/`, EdgeDB schema in `dbschema/*.gel`, and GraphQL schema.

### Repositories You MUST NEVER Modify, Analyze, or Query

**Explicit blocklist** — the following repos are strictly off-limits:
- **`SeedCompany/libs`** — Immutable monorepo. Consume packages via npm only (`@seedcompany/common`, `@seedcompany/scripture`).
- **`SeedCompany/infra`** — AWS CDK/CI/CD; never reference resource names or constructs in app code.
- **`SeedCompany/seed-api`** — Separate API; off-limits. Do not read or query.
- **`SeedCompany/investor-portal`** — Separate frontend; outside scope.
- **Legacy CORD API repos** — `cord-api` (v1/v2); do not access.
- **All other `SeedCompany/*` repos** — Not in scope.
- **All external repositories** — No org-level wildcard access.

### Hard Rules
- Never hardcode AWS ARNs, secret paths, or environment URLs in source code.
- Never mock or invent API response shapes — always derive from real API contracts.
- Never install a package that duplicates existing functionality in `@seedcompany/common` or `@seedcompany/libs`.
- Never modify `node_modules/`, `.yarn/patches/`, or vendored code without explicit approval.
