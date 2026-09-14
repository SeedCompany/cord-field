---
title: 'Delete the unused serviceWorker'
stage: 1
issue: 1
status: done
type: cleanup
---

# Delete the unused serviceWorker

## Context

[`src/serviceWorker.ts`](../src/serviceWorker.ts) is a leftover from the
Create React App scaffold this project descended from. It has **zero importers** —
the only references to its exported names are inside the file itself.

Removing it now means one fewer file to reason about when the entry points get
rewired in Stage 3.

## Task

Delete `src/serviceWorker.ts`.

## Definition of done

- The file is gone.
- `grep -rn "serviceWorker" src` returns nothing.
- `yarn type-check && yarn lint:check && yarn test && yarn build` still green
  under Razzle.
