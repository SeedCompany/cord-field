import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GQLOperations } from '../../../src/api/operationsList/operations.generated';

interface CoverageRow {
  operation: string;
  ok: boolean;
  hasErrors: boolean;
  errorMessages?: string[];
  persona: string;
  spec: string;
}

const readTag = (tag: string): CoverageRow[] => {
  const dir = join('tests/e2e/.coverage', tag);
  if (!existsSync(dir)) return [];
  const rows: CoverageRow[] = [];
  for (const file of readdirSync(dir)) {
    const contents = readFileSync(join(dir, file), 'utf8');
    for (const line of contents.split('\n')) {
      if (!line.trim()) continue;
      rows.push(JSON.parse(line));
    }
  }
  return rows;
};

const knownOperations = () => [
  ...Object.keys(GQLOperations.Query),
  ...Object.keys(GQLOperations.Mutation),
];

const summarize = (rows: CoverageRow[]) => ({
  exercised: new Set(rows.map((row) => row.operation)),
  errored: new Set(
    rows.filter((row) => row.hasErrors).map((row) => row.operation)
  ),
});

const printList = (label: string, items: string[]) => {
  console.log(`\n${label} (${items.length}):`);
  console.log(
    items.length
      ? [...items]
          .sort((a, b) => a.localeCompare(b))
          .map((i) => `  - ${i}`)
          .join('\n')
      : '  (none)'
  );
};

const main = () => {
  const args = process.argv.slice(2);
  const diffIndex = args.indexOf('--diff');

  if (diffIndex !== -1) {
    const [tagA, tagB] = args.slice(diffIndex + 1, diffIndex + 3);
    if (!tagA || !tagB) {
      console.error('Usage: e2e:coverage-report --diff <tagA> <tagB>');
      process.exitCode = 1;
      return;
    }
    const a = summarize(readTag(tagA));
    const b = summarize(readTag(tagB));
    printList(
      `Errored on "${tagA}" but not "${tagB}"`,
      [...a.errored].filter((op) => !b.errored.has(op))
    );
    printList(
      `Errored on "${tagB}" but not "${tagA}"`,
      [...b.errored].filter((op) => !a.errored.has(op))
    );
    return;
  }

  const tagIndex = args.indexOf('--tag');
  const tag =
    tagIndex !== -1
      ? args[tagIndex + 1]
      : process.env.PLAYWRIGHT_COVERAGE_TAG ?? 'default';
  const rows = readTag(tag!);
  if (rows.length === 0) {
    console.log(
      `No coverage data for tag "${tag}" — run the suite first ` +
        `(optionally with PLAYWRIGHT_COVERAGE_TAG=${tag}).`
    );
    return;
  }

  const { exercised: allExercised, errored } = summarize(rows);
  const known = knownOperations();
  // `allExercised` includes every operation name seen at all — subscriptions
  // (e.g. `NotificationAdded`, fired continuously once the notifications
  // feature flag is on) show up here too, but `known` deliberately excludes
  // them (Query + Mutation only). Without this filter, a fired subscription
  // silently inflates the numerator against a denominator that never
  // included it in the first place — confirmed live: this was overcounting
  // by exactly 1 (163 reported vs. 162 actual Query/Mutation coverage).
  const knownSet = new Set(known);
  const exercised = new Set([...allExercised].filter((op) => knownSet.has(op)));
  const unexercised = known.filter((op) => !exercised.has(op));

  console.log(`Coverage report for tag "${tag}"`);
  console.log(
    `Exercised: ${exercised.size} / ${known.length} known operations`
  );
  if (errored.size > 0) {
    // test.ts already filters out the one common false-positive
    // (PersistedQueryNotFound, an expected transient retry on a cold
    // cache) — anything showing up here is a real error worth a look.
    printList('Returned a GraphQL error at least once', [...errored]);
  }
  printList('Never exercised', unexercised);
};

main();
