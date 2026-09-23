---
title: 'Give Previewers explicit resolveComponent and drop their default exports'
stage: 1
issue: 6
status: done
type: refactor
---

# Give `Previewers` explicit `resolveComponent`

## Context

[`src/components/files/FilePreview/Previewers/index.ts`](../src/components/files/FilePreview/Previewers/index.ts)
is the only place using `@loadable/component`'s `lazy` export rather than
`loadable`:

```ts
import { lazy as loadable } from '@loadable/component';

export const Previewer = {
  Csv: loadable(() => import('./CsvPreview')),
  // ...
};
```

`lazy` resolves the module's **default export**, which is why each of the six
previewer files carries a trailing:

```ts
// eslint-disable-next-line import/no-default-export
export default CsvPreview;
```

Those default exports exist *only* to feed `lazy`. The codebase otherwise bans
default exports, and each one needs an eslint-disable to survive.

Converting to the `resolveComponent` form the other five loadable call sites
already use lets all six default exports go away, and means Stage 2's wrapper
migration is a one-line import change here like everywhere else.

This works **under Razzle today** — `@loadable/component`'s `loadable()` honours
`resolveComponent`, so nothing about the build changes.

## Task

```diff
-import { lazy as loadable } from '@loadable/component';
+import loadable from '@loadable/component';

 export const Previewer = {
-  Csv: loadable(() => import('./CsvPreview')),
+  Csv: loadable(() => import('./CsvPreview'), {
+    resolveComponent: (m) => m.CsvPreview,
+  }),
   // ... same for Email, Excel, Pdf, Rtf, Word
 };
```

Then delete the trailing `export default` (and its eslint-disable comment) from
each of the six previewer files: `CsvPreview`, `EmailPreview`, `ExcelPreview`,
`PdfPreview`, `RtfPreview`, `WordPreview`.

Leave `HtmlPreview`, `NativePreview`, `PlainTextPreview` and
`NotSupportedPreview` alone — they are eagerly imported, not loadable.

## Definition of done

- No `export default` remains in `src/components/files/FilePreview/Previewers/`.
- `grep -rn "import/no-default-export" src/components/files/FilePreview/Previewers/`
  returns nothing.
- **Manual check, not optional**: upload and open a `.csv`, `.docx`, `.xlsx`,
  `.rtf`, `.msg` and `.pdf`. These are lazy chunks — a green build proves nothing.
- `yarn type-check && yarn lint:check && yarn test && yarn build` green under
  Razzle.
