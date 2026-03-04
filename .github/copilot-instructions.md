---
applyTo: '**/*.{ts,tsx,graphql,gql}'
---

# Copilot Instructions — CORD Field

This is the **CORD Field** front-end application: a React/TypeScript SPA with server-side rendering via Razzle, backed by a GraphQL API ([cord-api-v3](https://github.com/SeedCompany/cord-api-v3)).

---

## Tech Stack

| Layer           | Technology                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Language        | TypeScript 5.x (strict mode, `noUncheckedIndexedAccess`)                                                     |
| UI              | React 18, MUI 5 (Material UI), Emotion                                                                       |
| Data            | Apollo Client 3, GraphQL, graphql-codegen                                                                    |
| Forms           | React Final Form (`final-form`)                                                                              |
| Routing         | React Router 6, `@loadable/component` (SSR code splitting)                                                   |
| Styling         | `tss-react/mui` `makeStyles` (legacy), MUI `sx` prop (preferred for new code), MUI `styled()`, Emotion `css` |
| SSR             | Razzle (Express-based)                                                                                       |
| Package Manager | Yarn 4 (Berry), Node ≥ 24                                                                                    |
| Formatting      | Prettier 2 — single quotes, default settings otherwise                                                       |
| Linting         | ESLint with `@seedcompany/eslint-plugin`                                                                     |

---

## Project Structure

```text
src/
├── api/              # Apollo client, caching utilities, error handling, codegen outputs
│   ├── client/       # Apollo Client creation, links, provider, impersonation
│   ├── caching/      # Cache helpers (updateFragment, addItemToList, invalidateObject)
│   ├── errorHandling/# Typed error codes, form error handling
│   ├── schema/       # Codegen plugins, generated schema types (schema.graphql.ts)
│   └── operationsList/ # Generated operations list for refetchQueries
├── common/           # Shared types, utilities, fragments
│   ├── fragments/    # Reusable GraphQL fragments (Id, Pagination, Scripture, etc.)
│   ├── secured.ts    # SecuredProp<T> type and helpers
│   ├── sx.ts         # Sx type, StyleProps interface, extendSx()
│   ├── styles.ts     # CSS helpers (square, flexColumn, gridTemplateAreas)
│   └── types.ts      # Nullable<T>, ChildrenProp, etc.
├── components/       # Reusable UI components
│   ├── form/         # Form field wrappers (TextField, AutocompleteField, EnumField, etc.)
│   ├── Dialog/       # Dialog + DialogForm + useDialog hook
│   ├── Routing/      # Link, ButtonLink, TabLink, Navigate (SSR-aware)
│   ├── Session/      # Session provider, useSession hook
│   ├── Tabs/         # Tab, TabLink, TabsContainer, TabPanelContent
│   └── ...           # Domain-specific cards, grids, breadcrumbs, etc.
├── scenes/           # Page-level components (route handlers, non-reusable)
│   ├── Root/         # Root router, layout shell
│   ├── Projects/     # Project list, detail, overview, budget, etc.
│   ├── Languages/    # Language list, detail
│   └── ...           # Partners, Organizations, Users, etc.
├── hooks/            # Custom hooks (useQueryParams, useDialog, etc.)
├── theme/            # MUI theme creation, palette, typography, overrides
├── App.tsx           # Provider composition via Nest pattern
└── server/           # Express SSR server
```

---

## Coding Standards

- Use single quotes for strings, 2 spaces for indentation.
- Prefer arrow functions for callbacks, `async`/`await` for asynchronous code.
- Use `const` for constants; minimize `let` usage (e.g., except in try/catch).
- Use destructuring for objects/arrays, template literals for strings.
- Follow SOLID principles for modular, reusable, maintainable code.
- Avoid code duplication, deeply nested statements, and hard-coded values.
- Use constants/enums instead of magic numbers/strings.
- Avoid mutations (non-GraphQL):
  - Prefer `const` over `let`.
  - Use spread syntax (e.g., `{ ...object, foo: 'bar' }`) instead of modifying objects.
- Use strict TypeScript:
  - Define all object shapes in `src/common` or generated GraphQL types in `src/api`.
  - Use optional chaining (`?.`) or type guards for safe property access.
  - Never assume properties exist without type verification.

---

## Key Conventions

### Components

- **Functional components only** — no class components.
- **Named exports** — never use default exports. This enables `@loadable/component` code splitting with `resolveComponent`.
- **Do NOT use `React.FC`** — it is banned via ESLint. Declare props on the first argument explicitly.
- **Props**: Use `interface` named `{ComponentName}Props`, defined directly above the component. Use `type` for intersection/mapped types.
- **`ChildrenProp`** is the shared type for `{ children?: ReactNode }`.
- Each component lives in a folder: `ComponentName/ComponentName.tsx` + `index.ts` barrel export.
- Pass most props through to wrapping components for reusability.
- Match designs or comment stop-gap versions.
- Avoid unnecessary HTML wrapper elements for styling (e.g., `<MyCard sx={{ m: 1 }} />` instead of `<Box sx={{ m: 1 }}><MyCard /></Box>`).

```tsx
// ✅ Correct
export interface MyCardProps extends StyleProps {
  data: MyCardFragment;
  loading?: boolean;
}

export const MyCard = ({ data, loading, sx, className }: MyCardProps) => {
  // ...
};

// ❌ Wrong
export default function MyCard(props) { ... }
const MyCard: React.FC<Props> = (props) => { ... }
```

### Styling

Two approaches coexist. **Prefer `sx` prop for new code**; `makeStyles` is legacy but acceptable in existing files.

1. **MUI `sx` prop** (preferred for new code):

   ```tsx
   <Box sx={(theme) => ({ p: 2, color: theme.palette.primary.main })} />
   ```

2. **`tss-react/mui` `makeStyles`** (legacy/dominant in existing code):

   ```tsx
   import { makeStyles } from 'tss-react/mui';

   const useStyles = makeStyles()(({ spacing, palette }) => ({
     root: { padding: spacing(2) },
     title: { color: palette.primary.main },
   }));

   export const MyComponent = () => {
     const { classes, cx } = useStyles();
     return <div className={cx(classes.root)}> ... </div>;
   };
   ```

- Expose style customization with `StyleProps` (`{ sx?: Sx; className?: string }`) from `~/common`.
- Use `extendSx(props.sx)` to compose `sx` arrays.
- Import `styled` from `@mui/material/styles` — **never** from `@emotion/styled` directly.
- Import `css` and `keyframes` from `@emotion/react` — **never** from MUI or tss-react re-exports.
- Import `useTheme` from `@mui/material/styles`.
- Reference `src/theme` for spacing (1–8), palette colors, typography variants.
- Comment if using magic numbers/colors/fonts. Use `// ai edge-case` for justified deviations.
- Ensure styles are minimal, necessary, and responsive across screen sizes.

**Parent components own layout styles**: Apply layout-related styles (centering, alignment, spacing) to parent components, not children, to ensure encapsulation and reusability.

```tsx
// ✅ Parent owns centering
<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
  <Card sx={{ width: 300 }}>Content</Card>
</Box>

// ❌ Child assumes parent's layout
<Box sx={{ p: 2 }}>
  <Card sx={{ margin: 'auto', width: 300 }}>Content</Card>
</Box>
```

**Order control styles before appearance styles** in `sx` declarations for readability:

```tsx
// ✅ Control styles first, then appearance
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
/>

// ❌ Mixed order
<Box
  sx={{
    color: 'white',
    display: 'flex',
    backgroundColor: 'primary.main',
    padding: 2,
  }}
/>
```

### Imports

- **Path alias**: `~/` maps to `src/`. Use for cross-domain imports:
  ```tsx
  import { labelFrom } from '~/common';
  import { ProjectStepLabels } from '~/api/schema.graphql';
  import { Tab, TabsContainer } from '~/components/Tabs';
  ```
- **Relative paths** for same-subfolder imports. ESLint enforces: no `~/folder` imports from within `folder`.
- **Import order**: External packages → `~/` absolute imports → relative imports.
- **Tree-shaking**: Import specific things from MUI (`import { Button } from '@mui/material'`), never the default export.
- **Lodash**: Import from root (`import { sortBy } from 'lodash'`), never from `lodash/sortBy` or `lodash/fp`.
- **React Router**: Import from `react-router-dom`, not `react-router`.
- **Link component**: Use `~/components/Routing/Link` — never MUI's `Link` or React Router's `Link` directly.

### GraphQL

- **Co-locate** `.graphql` files next to the component that uses them.
- **Fragment-first**: Define fragments for data shapes. Compose fragments across components.
- Shared fragments live in `src/common/fragments/`.
- Codegen generates `.graphql.ts` files — **never hand-edit** these.
- Run `yarn gql-gen` after modifying any `.graphql` file.
- Use typed document nodes directly with Apollo hooks — no need for generic type params:
  ```tsx
  const { data } = useQuery(MyQueryDocument, { variables: { input: id } });
  const [doMutation] = useMutation(MyMutationDocument);
  ```
- Use `GQLOperations.Queries.MyQuery` for `refetchQueries` — avoid magic strings.
- Types are **immutable** (`readonly` arrays, `Readonly` objects) from codegen.
- Enums are generated as **string union types** (not TS enums). Label maps are generated alongside (e.g., `ProjectStepLabels`). Use `labelFrom(ProjectStepLabels)` to convert values to display strings.
- **Scalars**: Custom scalar types are mapped to local types — `Date` → `CalendarDateOrISO`, `DateTime` → `DateTimeOrISO`, `RichText` → `RichTextJson`, `Markdown` → `MarkdownString`.

### Secured Properties

The API wraps fields in a `SecuredProp<T>` structure: `{ canRead: boolean, canEdit: boolean, value?: T }`.

- Use `isSecured()`, `unwrapSecured()`, `canReadAny()`, `canEditAny()` from `~/common/secured`.
- Use `<SecuredField>` to conditionally render form fields based on permissions.
- Component props often reference generated fragment types that contain secured props.

### Forms

- Built on **React Final Form** with extensive wrappers in `src/components/form`.
- Use `<Form>` from `~/components/form/Form` — it handles error throwing, `onSuccess`, changeset awareness.
- Field components (`TextField`, `AutocompleteField`, `EnumField`, `DateField`, etc.) wrap both Final Form and MUI.
- `<DialogForm>` combines a dialog with a form, handling auto-focus, submit/close buttons, and changesets.
- `useField()` from `~/components/form/useField` supports auto-required validation, `FieldGroup` contexts, and focus management.
- Validators are pure functions returning `string | undefined`.

### Routing

- Use React Router v6 patterns (`<Routes>`, `<Route>`).
- Code-split route-level components with `@loadable/component`:
  ```tsx
  const Partners = loadable(() => import('../Partners'), {
    resolveComponent: (m) => m.Partners,
  });
  ```
- Use `<Link>` / `<ButtonLink>` / `<TabLink>` from `~/components/Routing`.
- URL query params: use `makeQueryHandler` / `useQueryParams` with `serialize-query-params`.
- `<Navigate>` supports SSR with proper status codes (301/302).

### State Management

- **Apollo Client** is the primary state manager for server data.
- **No Redux/Zustand** for app state — use Apollo cache, reactive variables, React Context, or URL query params.
- Cache helpers in `~/api/caching`: `updateFragment()`, `addItemToList()`, `removeItemFromList()`, `invalidateObject()`.
- React Context for cross-cutting concerns: session, impersonation, comments, changesets.
- `useDialog()` for local dialog state — returns `[state, show, item]` tuple.
- Feature flags via PostHog.

### Error Handling

- Typed error system with codes: `Validation`, `NotFound`, `Duplicate`, `TokenInvalid`, `MissingRequiredFields`, etc.
- Forms use `errorHandlers` prop mapping error codes to field-level or form-level error messages.
- `handleFormError()` connects API errors to Final Form's submission error system.

### Provider Composition

Providers are composed via the `<Nest>` component in `App.tsx`:

```tsx
export const appProviders = [
  <ThemeProvider key="theme" theme={createTheme()} />,
  <ApolloProvider key="apollo" />,
  <SessionProvider key="session" />,
  // ... flat list, order matters (first = outermost)
];

export const App = () => (
  <Nest elements={appProviders}>
    <Root />
  </Nest>
);
```

### Type Patterns

- Generated fragment types are the source of truth for component props.
- Use `type-fest` utilities: `Except`, `PartialDeep`, `Promisable`, `MergeExclusive`, `Paths`, `PickDeep`.
- `isTypename<T>('TypeName')` is a curried type guard factory for GraphQL `__typename` discrimination.
- Generic components use TypeScript generics (`Form<FormValues>`, `AutocompleteField<T, Multiple>`).
- Emotion's `Theme` is augmented to match MUI's `Theme` via declaration merging.

---

## Common Errors to Avoid

- **Accessing non-existent properties**: Never assume properties exist without type verification. Use optional chaining (`?.`) or type guards (`if ('foo' in obj)`).

  ```tsx
  // ✅ Safe
  const name = user?.name ?? 'Unknown';

  // ❌ Unsafe — runtime error if property missing
  const name = user.name;
  ```

- **Untyped objects**: Always reference TypeScript interfaces in `src/common` or generated GraphQL types in `src/api`.
- **Mutating data**: Use spread syntax or immutable patterns instead of modifying objects/arrays in place.

---

## File Naming

| Kind              | Convention                       | Example                          |
| ----------------- | -------------------------------- | -------------------------------- |
| Component         | PascalCase matching export       | `BudgetOverviewCard.tsx`         |
| GraphQL operation | Same name as component           | `BudgetOverviewCard.graphql`     |
| Codegen output    | `.graphql.ts` or `.generated.ts` | `BudgetOverviewCard.graphql.ts`  |
| Hook              | `use` prefix, camelCase          | `useDialog.tsx`                  |
| Utility           | camelCase or kebab-case          | `array-helpers.ts`               |
| Barrel            | `index.ts` in every folder       | `index.ts`                       |
| Story             | `.stories.tsx` suffix            | `BudgetOverviewCard.stories.tsx` |

---

## Tagged Comments

Use `// ai tag` to mark code for searchability and reference:

| Tag                | Purpose                               |
| ------------------ | ------------------------------------- |
| `example`          | Best practice or model code           |
| `edge-case`        | Necessary deviation from standards    |
| `best-practice`    | Adherence to coding standards         |
| `anti-pattern`     | Code to avoid (pending refactor)      |
| `todo`             | Needs improvement or refactoring      |
| `workaround`       | Temporary fix for a limitation        |
| `performance`      | Optimized code                        |
| `security`         | Security-critical code                |
| `test`             | Exemplary test case                   |
| `design-alignment` | Matches or deviates from design specs |
| `type-safety`      | Safe property access                  |

Optionally add notes after the tag: `// ai example Reusable form with theme-based styling`.
Search tags with `git grep "ai "`.

---

## Commands

| Task                   | Command           |
| ---------------------- | ----------------- |
| Dev server             | `yarn start`      |
| Generate GraphQL types | `yarn gql-gen`    |
| Build                  | `yarn build`      |
| Lint (fix)             | `yarn lint`       |
| Lint (check only)      | `yarn lint:check` |
| Type-check             | `yarn type-check` |
| Test                   | `yarn test`       |
| Clean generated files  | `yarn clean`      |
