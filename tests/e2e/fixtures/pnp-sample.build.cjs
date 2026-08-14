/* eslint-disable no-console */
/**
 * Generates tests/e2e/fixtures/pnp-sample.xlsx — a minimal but structurally
 * faithful "written scripture" PnP (Planning & Progress) workbook that
 * cord-api-v3's `Pnp.fromBuffer()` + extractors can parse.
 *
 * Run with:  yarn node tests/e2e/fixtures/pnp-sample.build.cjs
 *
 * Layout is derived from cord-api-v3:
 *   src/components/pnp/{pnp,planning-sheet,progress-sheet,findStepColumns,isGoalRow}.ts
 *   src/components/product/product.extractor.ts
 *   src/components/product-progress/step-progress-extractor.service.ts
 *   src/components/progress-summary/progress-summary.extractor.ts
 */
const path = require('path');
const XLSX = require('xlsx');

const OUT = path.join(__dirname, 'pnp-sample.xlsx');

// --- PnP-wide constants -----------------------------------------------------
// Project date range declared inside the PnP (Planning!Z14 / Planning!Z15).
// Fiscal years (Oct 1 – Sep 30) FY2025 → FY2027.
//
// Dates are stored at 12:00 UTC (Excel serial fraction .5) on purpose: SheetJS
// round-trips date cells as absolute instants, and the API turns them into a
// calendar day with the *server's* local zone. Noon UTC keeps the day stable
// for every zone from UTC-12 to UTC+11.
const utcNoon = (y, m, d) => new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
const PROJECT_START = utcNoon(2024, 10, 1);
const PROJECT_END = utcNoon(2027, 9, 30);
const REVISION = utcNoon(2025, 6, 1); // > 2025-02-24 ⇒ goal column is P

// Step labels. Must be identical (and in the same order) on both sheets so
// findStepColumns() produces the same key set for both maps.
// The *last* label is always coerced to ProductStep.Completed by the parser.
const STEP_LABELS = [
  'Exegesis & First Draft', // → ExegesisAndFirstDraft (exact)
  'Team Check', // → TeamCheck (exact)
  'Community Testing', // → CommunityTesting (exact)
  'Back Translation', // → BackTranslation (exact)
  'Consultant Check', // → ConsultantCheck (exact)
  'Completed', // → Completed (forced: last label)
];

// --- tiny sheet builder -----------------------------------------------------
const newSheet = () => ({});

const set = (ws, addr, value) => {
  if (value === null || value === undefined) return;
  if (value instanceof Date) {
    ws[addr] = { t: 'd', v: value, z: 'm/d/yyyy' };
  } else if (typeof value === 'number') {
    ws[addr] = { t: 'n', v: value };
  } else {
    ws[addr] = { t: 's', v: String(value) };
  }
};

const setRow = (ws, row, startCol, values) => {
  const startIdx = XLSX.utils.decode_col(startCol);
  values.forEach((v, i) => {
    set(ws, `${XLSX.utils.encode_col(startIdx + i)}${row}`, v);
  });
};

const finalize = (ws) => {
  let maxC = 0;
  let maxR = 0;
  for (const addr of Object.keys(ws)) {
    if (addr.startsWith('!')) continue;
    const { c, r } = XLSX.utils.decode_cell(addr);
    if (c > maxC) maxC = c;
    if (r > maxR) maxR = r;
  }
  ws['!ref'] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: maxC, r: maxR } });
  return ws;
};

// --- Planning sheet ---------------------------------------------------------
// goal column P (revision > 2025-02-24), also mirrored into Q so the file still
// parses if the revision date ever fails to read as a date (then col = Q).
const planning = newSheet();
set(planning, 'A1', 'Seed Company — Planning & Progress (test fixture)');
set(planning, 'A2', 'NOT a real PnP template. Generated for Playwright E2E tests.');

// Header/marker cells read by PlanningSheet
set(planning, 'Y11', 'Revision:');
set(planning, 'Z11', REVISION); // WrittenScripturePlanningSheet.revisionCell
set(planning, 'Y14', 'Project Start:');
set(planning, 'Z14', PROJECT_START); // projectStartDateCell
set(planning, 'Y15', 'Project End:');
set(planning, 'Z15', PROJECT_END); // projectEndDateCell
set(planning, 'P19', 'Books'); // OBS marker cell — must NOT be 'Stories'

// Step label row: stepLabels = U18:Z18
setRow(planning, 18, 'U', STEP_LABELS);

// Human-friendly column headers (not read by the parser)
set(planning, 'P22', 'Books');
set(planning, 'T22', 'Total Verses');
set(planning, 'AI22', 'My Notes');

// Goal rows start at row 23 (goalsStart = <goalColumn>23)
const planningGoals = [
  { book: 'Matthew', verses: 1071, steps: [2025, 2025, 2026, 2026, 2027, 2027] },
  { book: 'Mark', verses: 678, steps: [2025, 2026, 2026, 2027, 2027, 2027] },
];
planningGoals.forEach((goal, i) => {
  const row = 23 + i;
  set(planning, `P${row}`, goal.book);
  set(planning, `Q${row}`, goal.book); // defensive mirror
  set(planning, `T${row}`, goal.verses); // totalVerses column
  setRow(planning, row, 'U', goal.steps); // planned-complete fiscal years
});
// Terminator row — WrittenScripturePlanningSheet.goalsEnd stops here
const planningEndRow = 23 + planningGoals.length;
set(planning, `P${planningEndRow}`, 'Other Goals and Milestones');
set(planning, `Q${planningEndRow}`, 'Other Goals and Milestones');
finalize(planning);

// --- Progress sheet ---------------------------------------------------------
const progress = newSheet();
set(progress, 'A1', 'Seed Company — Planning & Progress (test fixture)');

// Progress summary block (rows 5-8, cols B-J) — read by ProgressSummaryExtractor
set(progress, 'B5', 'FY');
set(progress, 'C5', 'Q1');
set(progress, 'D5', 'Q2');
set(progress, 'E5', 'Q3');
set(progress, 'F5', 'Q4');
set(progress, 'G5', 'FY Planned');
set(progress, 'H5', 'FY Actual');
set(progress, 'I5', 'Cumulative Planned');
set(progress, 'J5', 'Cumulative Actual');
const summaryRows = [
  [2025, 0.05, 0.1, 0.15, 0.2, 0.2, 0.18, 0.2, 0.18],
  [2026, 0.25, 0.3, 0.35, 0.4, 0.4, 0, 0.6, 0.18],
  [2027, 0.45, 0.5, 0.55, 0.6, 0.6, 0, 1, 0.18],
];
summaryRows.forEach((vals, i) => setRow(progress, 6 + i, 'B', vals));

// Reporting quarter + verse equivalents (named ranges below)
set(progress, 'AC3', 'Reporting Quarter:');
set(progress, 'AD3', 'Q2'); // RptQtr
set(progress, 'AE3', 2025); // RptYr  ⇒ Jan 1 – Mar 31 2025
set(progress, 'AC5', 'Total Verse Equivalents:');
set(progress, 'AD5', 1749); // VE (1071 + 678)

// Header row 19: P = goal/book, Q = total verses, R:AB = step labels.
// Each step occupies 2 columns (quarter + year) except the last one,
// so labels sit at R, T, V, X, Z, AB — exactly filling stepLabels R19:AB19.
set(progress, 'P19', 'Books'); // OBS marker cell — must NOT be 'Stories'
set(progress, 'Q19', 'Total Verses');
const PROGRESS_STEP_COLS = ['R', 'T', 'V', 'X', 'Z', 'AB'];
PROGRESS_STEP_COLS.forEach((col, i) => set(progress, `${col}19`, STEP_LABELS[i]));

// Goal rows start at row 20 (= ProgDraft named range's start row)
const progressGoals = [
  {
    book: 'Matthew',
    verses: 1071,
    // [quarter, fiscalYear] pairs, or a raw percent decimal, or null
    steps: [['Q2', 2025], ['Q4', 2025], 0.5, null, null, null],
  },
  {
    book: 'Mark',
    verses: 678,
    steps: [['Q1', 2026], 0.25, null, null, null, null],
  },
];
progressGoals.forEach((goal, i) => {
  const row = 20 + i;
  set(progress, `P${row}`, goal.book);
  set(progress, `Q${row}`, goal.verses);
  goal.steps.forEach((val, s) => {
    const col = PROGRESS_STEP_COLS[s];
    if (val === null || val === undefined) return;
    if (Array.isArray(val)) {
      set(progress, `${col}${row}`, val[0]);
      set(progress, `${XLSX.utils.encode_col(XLSX.utils.decode_col(col) + 1)}${row}`, val[1]);
    } else {
      set(progress, `${col}${row}`, val);
    }
  });
});
const progressEndRow = 20 + progressGoals.length;
set(progress, `P${progressEndRow}`, 'Other Goals and Milestones');
finalize(progress);

// --- Workbook ---------------------------------------------------------------
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, planning, 'Planning');
XLSX.utils.book_append_sheet(wb, progress, 'Progress');

wb.Workbook = wb.Workbook || {};
wb.Workbook.Names = [
  // ProgressSheet.goalsStart = Progress!P<ProgDraft.start.row>
  { Name: 'ProgDraft', Ref: `Progress!$R$20:$R$${progressEndRow - 1}` },
  { Name: 'RptQtr', Ref: 'Progress!$AD$3' },
  { Name: 'RptYr', Ref: 'Progress!$AE$3' },
  { Name: 'VE', Ref: 'Progress!$AD$5' },
  { Name: 'PrcntFinishedYears', Ref: 'Progress!$B$6:$B$8' },
  { Name: 'Q1Column', Ref: 'Progress!$C$5' },
  { Name: 'Q2Column', Ref: 'Progress!$D$5' },
  { Name: 'Q3Column', Ref: 'Progress!$E$5' },
  { Name: 'Q4Column', Ref: 'Progress!$F$5' },
];

XLSX.writeFile(wb, OUT, { bookType: 'xlsx', compression: true });
console.log('wrote', OUT);
