# Copilot Instructions

This project is a web application built with React 18, Material-UI (MUI), and GraphQL, using Yarn as the package manager and Razzle for the custom build process. Follow these guidelines to ensure consistent, high-quality code aligned with our coding standards.

## Coding Standards

- Use camelCase for variables, functions, and methods.
- Use PascalCase for React components, classes, and enums.
- Use kebab-case for new folders and files.
- Use single quotes for strings.
- Use 2 spaces for indentation.
- Prefer arrow functions for callbacks.
- Use async/await for GraphQL queries and mutations.
- Use const for constants, let for reassignable variables.
- Use destructuring for objects and arrays.
- Use template literals for dynamic strings.
- Follow SOLID principles for modular, reusable, and maintainable code.
- Avoid code duplication, deeply nested statements, and hard-coded values (e.g., file paths, usernames).
- Use constants or enums instead of magic numbers/strings for readability and memory efficiency.

## Project Preferences

- Use React with functional components and hooks.
- Use Material-UI (MUI) v5 for UI components and styling:
  - Use the `sx` prop as the primary styling method.
  - Avoid `useStyles` or `makeStyles` (MUI v4 patterns).
  - Reference `src/theme` for custom MUI theme configurations in `sx` (e.g., `sx={{ color: theme.palette.primary.main }}`).
- Use Apollo Client for GraphQL:
  - Write type-safe queries and mutations with generated TypeScript types.
  - Store queries, mutations, and fragments in `src/api`.
- Use Yarn for package management:
  - Run `yarn add` for dependencies, checking for vulnerabilities with Snyk.
  - Use `yarn start`, `yarn build`, and `yarn test` for Razzle scripts.
- Custom build process with Razzle:
  - Configure Razzle in `razzle.config.js` for build settings.
  - Optimize for production with code splitting and server-side rendering (SSR).
  - Use `src/server` for Razzle server configurations.
- Use TypeScript for all code:
  - Enforce strict mode.
  - Define interfaces and types in `src/common`.
- Follow folder structure:
  - `src/api`: GraphQL queries, mutations, Apollo Client setup, and API-related files.
  - `src/common`: Utility TypeScript files (types, interfaces, general-use TS).
  - `src/components`: Reusable React components (mostly TSX, some with GraphQL files), with subfolders.
  - `src/hooks`: Custom React hooks (TypeScript).
  - `src/scenes`: Application-specific, non-reusable components (mostly TSX, some with GraphQL files), with subfolders.
  - `src/server`: Razzle server configuration files.
  - `src/theme`: MUI theme configuration files.

## Version Control

- Create branches with format: `type/MondayTicketID-description` (e.g., `enhancement/1234-new-profile-page`).
- Write commit messages:
  - First line: `[TicketID] - [Short Title] - Imperative verb` (e.g., `0654 - IRP - Remove/move Impact Report Date`).
  - Optional body: Briefly explain why the change is needed or the problem addressed.
- Create PRs for single, specific changes (one user story per PR unless deployable in isolation):
  - Link the Monday ticket in the PR description.
  - Break changes into bite-sized, logical commits for easier review and potential reversion.
  - Demo functionality to reviewers when needed.

## Security Practices

- Sanitize all user inputs to prevent XSS.
- Use Apollo Client’s error handling for GraphQL responses in `src/api`.
- Implement role-based access control (RBAC) via GraphQL context.
- Configure secure cookies (`HttpOnly`, `Secure`, `SameSite=Strict`) in `src/server`.
- Enforce Content Security Policy (CSP) in Razzle’s server configuration in `src/server`.
- Validate data from external sources (APIs, databases) for expected formats.
- Check new dependencies with Snyk for vulnerabilities before adding via Yarn.

## Form Development

- Use custom form components built with Final Form and react-final-form in `src/components/form`:
  - Use components like `Form`, `Field`, and custom inputs for consistent behavior.
  - Define TypeScript interfaces in `src/common` for form data and props.
  - Use `react-final-form` hooks (e.g., `useForm`, `useField`) for form state management.
- Integrate MUI v5 components (`TextField`, `Select`, etc.) within form components:
  - Apply `sx` prop, referencing `src/theme` for consistency.
- Use `yup` for validation:
  - Store schemas in `src/common/validation`.
  - Ensure TypeScript compatibility.
  - Integrate with react-final-form for user-friendly error messages.

## General Guidelines

- Write clear, concise code with single-responsibility modules.
- Add JSDoc comments for public functions and components (optional: include purpose and description).
- Optimize performance:
  - Use `React.memo`, `useCallback`, `useMemo` for React components.
  - Minimize loop iterations, redundant operations, and memory allocations.
  - Process data in chunks for large datasets.
  - Optimize GraphQL queries in `src/api` for efficient data retrieval.
- Avoid changing code outside the task scope; create separate PRs for refactors.
- Keep responses friendly, informal, and under 1000 characters.
- Reference `styleguide.md` in `docs/` for additional styling rules.

## Testing

- Use Jest and React Testing Library for unit tests:
  - Place tests in `__tests__` folders in `src/components` and `src/scenes`.
  - Mock GraphQL queries with `@apollo/client/testing` for `src/api` files.
  - Mock react-final-form for form tests using `react-final-form` testing utilities.
- Write descriptive tests focusing on user interactions.
- Ensure functional quality:
  - Unit testing in development.
  - Regression and smoke testing in production or development as needed.
- Validate all acceptance criteria in PR reviews.

## Additional Notes

- Reference GraphQL schemas in `src/api/schema.graphql`.
- Avoid external resource references unless specified.
- If instructions seem ignored, remind Copilot to check this file.- Use tagged comments (`// cp tag`) to mark code for reference:
  - `example`: Best practice or model code.
  - `edge-case`: Necessary deviation from standards.
  - `best-practice`: Adherence to coding standards.
  - `anti-pattern`: Code to avoid (pending refactor).
  - `todo`: Needs improvement or refactoring.
  - `workaround`: Temporary fix for a limitation.
  - `performance`: Optimized code.
  - `security`: Security-critical code.
  - `test`: Exemplary test case.
  - `design-alignment`: Matches or deviates from design specs.
- After the tag, optionally add notes to explain the context (e.g., `// cp example Reusable form with theme-based styling`).
- Search for tags with `git grep "cp "` to collect examples for this document.
