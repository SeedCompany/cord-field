// @ts-check
/** @type {import('lint-staged').Configuration} */
export default {
  '**/*.{js,mjs,ts,tsx}': (files) => {
    // auto fix & format
    const lint = `LINT_STAGED=1 yarn eslint --fix --report-unused-disable-directives-severity=off ${files.join(' ')}`;
    // but don't block the commit
    const lintSafe = `sh -c '${lint} || true'`;
    const prettier = `yarn prettier --write ${files.join(' ')}`;
    return [prettier, lintSafe];
  },
};
