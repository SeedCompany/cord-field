# CORD Front-End Development Guidelines

This document provides guidelines for developers working on the CORD Field front-end project, a UI built with React, Material-UI (MUI) v5, and GraphQL, using Yarn and Razzle. The front-end connects to the CORD API v3.

### Project Structure

- `src/`: Source code
  - `src/api/`: client setup, caching strategies, schema definitions, and operation management.
  - `src/common/`: Utility TypeScript files (types, interfaces).
  - `src/components/`: Reusable React components (mostly TSX, some with GraphQL files), with subfolders (e.g., `form/` for Final Form components).
  - `src/hooks/`: Custom React hooks (TypeScript).
  - `src/scenes/`: Application-specific, non-reusable components (mostly TSX, some with GraphQL files), with subfolders.
  - `src/server/`: server-side code and configuration files.
  - `src/theme/`: MUI theme configuration files.

### Coding Standards

- Use single quotes for strings, 2 spaces for indentation.
- Prefer arrow functions for callbacks, async/await for GraphQL queries/mutations.
- Use `const` for constants, minimize `let` usage (e.g., except in try/catch).
- Use destructuring for objects/arrays, template literals for strings.
- Follow SOLID principles for modular, reusable, maintainable code.
- Avoid code duplication, deeply nested statements, hard-coded values.
- Use constants/enums instead of magic numbers/strings.
- Avoid mutations (non-GraphQL):
  - Prefer `const` over `let`.
  - Use spread syntax (e.g., `{ ...object, foo: 'bar' }`) instead of modifying objects.
- Use strict TypeScript:
  - Define all object shapes in `src/common` or generated GraphQL types in `src/api`.
  - Use optional chaining (`?.`) or type guards for safe property access.

### React Guidelines

- For new small components:
  - Pass most props to wrapping components for reusability.
  - Match designs or comment stop-gap versions.
- Avoid unnecessary HTML elements for styling (e.g., `<MyCard sx={{ m: 1 }} />` instead of `<Box sx={{ m: 1 }}><MyCard /></Box>`).
- Use optional chaining (`?.`) or type guards for object properties.

### Form Development

- Use custom form components with Final Form and react-final-form in `src/components/form`.

### CSS Guidelines

- Use `sx` prop for styling; avoid StyledComponents or `makeStyles`.
- Reference `src/theme` for spacing (1-8), palette colors, typography variants.
- Comment if using magic numbers/colors/fonts.
- Ensure styles are minimal, necessary, and responsive across screen sizes.
- Use `// ai edge-case` for justified deviations (e.g., non-theme colors).
- **Parent components own layout styles**: Apply layout-related styles (e.g., centering, alignment, spacing) to parent components, not children, to ensure encapsulation and reusability.
  - Example (Correct):
    ```tsx
    // ai example Parent-owned centering
    // src/components/CenteredCard.tsx
    import { Box, Card } from '@mui/material';
    export const CenteredCard = () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Card sx={{ width: 300 }}>Content</Card>
      </Box>
    );
    ```
    _Why_: Parent `<Box>` controls centering, keeping `<Card>` reusable.
  - Example (Incorrect):
    ```tsx
    // ai anti-pattern Child-owned centering
    // src/components/CenteredCard.tsx
    import { Box, Card } from '@mui/material';
    export const CenteredCard = () => (
      <Box sx={{ p: 2 }}>
        <Card sx={{ margin: 'auto', width: 300 }}>Content</Card>
      </Box>
    );
    ```
    _Why_: `<Card>` assumes parent’s layout, reducing reusability.
- **Order control styles before appearance styles**: In `sx` prop declarations, list control styles (e.g., `display`, `padding`, `width`) before appearance styles (e.g., `color`, `background`, `fontSize`) for readability.
  - Example (Correct):
    ```tsx
    // ai example Ordered sx styles
    // src/components/StyledBox.tsx
    import { Box } from '@mui/material';
    export const StyledBox = () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          width: '100%',
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 1,
          fontSize: 16,
        }}
      >
        Content
      </Box>
    );
    ```
    _Why_: Control styles (`display`, `justifyContent`, `padding`, `width`) precede appearance styles (`backgroundColor`, `color`, `borderRadius`, `fontSize`), enhancing readability.
  - Example (Incorrect):
    ```tsx
    // ai anti-pattern Disordered sx styles
    // src/components/StyledBox.tsx
    import { Box } from '@mui/material';
    export const StyledBox = () => (
      <Box
        sx={{
          color: 'white',
          display: 'flex',
          backgroundColor: 'primary.main',
          padding: 2,
          fontSize: 16,
          justifyContent: 'center',
          borderRadius: 1,
          width: '100%',
        }}
      >
        Content
      </Box>
    );
    ```
    _Why_: Mixed style order reduces readability and maintainability.

### Common Errors to Avoid

- **Accessing Non-Existent Properties**:
  - Never assume properties exist without type verification.
  - Reference TypeScript interfaces in `src/common` or generated GraphQL types in `src/api`.
  - Use optional chaining (`?.`) or type guards (e.g., `if ('foo' in obj)`).
  - Example (Correct):
    ```tsx
    // ai type-safety Safe property access with optional chaining
    interface User {
      name?: string;
    }
    const user: User = {};
    const name = user?.name ?? 'Unknown';
    ```
    _Why_: Prevents runtime errors by checking property existence.
  - Example (Incorrect):
    ```tsx
    // ai anti-pattern Assumes non-existent property
    const user = {};
    const name = user.name; // Error: Property 'name' does not exist
    ```
    _Why_: Causes runtime errors due to unverified property access.

### Tagged Comments

- Use `// ai tag` to mark code for reference:
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
  - `type-safety`: Safe property access.
- Optionally add notes after the tag (e.g., `// ai example Reusable form with theme-based styling`).
- Search tags with `git grep "ai "` to collect examples.
