#!/usr/bin/env bash
set -e;

status=0
tsc -p src/tsconfig.app.json --noEmit || status=1
tsc -p src/tsconfig.spec.json --noEmit || status=1
tsc -p e2e/tsconfig.e2e.json --noEmit || status=1
ng lint cord-field || status=1
ng lint cord-field-e2e || status=1
exit ${status}
