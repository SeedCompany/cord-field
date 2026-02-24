/**
 * Unit tests for pure logic extracted from LookupField.tsx.
 *
 * The component itself requires Apollo, useSession, useField, etc., so we
 * follow the same extraction pattern used in form-error-handling.test.ts and
 * CreateLanguageEngagement.test.tsx: pull each logical unit into a plain
 * function and test it in isolation.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { camelCase, uniqBy, upperFirst } from 'lodash';

// ---------------------------------------------------------------------------
// Helpers shared across test suites
// ---------------------------------------------------------------------------

interface Item {
  id: string;
  label: string;
}

const makeItem = (id: string, label = `Item ${id}`): Item => ({ id, label });

const compareById = (item: Item) => item.id;

// ---------------------------------------------------------------------------
// getOptionLabel
// ---------------------------------------------------------------------------

/**
 * Recreates the closure inside LookupField:
 *   const getOptionLabel = (val: T | string) =>
 *     typeof val === 'string' ? val : getOptionLabelProp(val) ?? '';
 */
const makeGetOptionLabel =
  (getOptionLabelProp: (option: Item) => string | null | undefined) =>
  (val: Item | string): string =>
    typeof val === 'string' ? val : getOptionLabelProp(val) ?? '';

describe('getOptionLabel', () => {
  const getOptionLabel = makeGetOptionLabel((item) => item.label);

  it('returns string values as-is (freeSolo path)', () => {
    expect(getOptionLabel('raw input')).toBe('raw input');
  });

  it('returns the label for a typed option', () => {
    expect(getOptionLabel(makeItem('1', 'English'))).toBe('English');
  });

  it('falls back to empty string when getOptionLabelProp returns null', () => {
    const fn = makeGetOptionLabel(() => null);
    expect(fn(makeItem('1'))).toBe('');
  });

  it('falls back to empty string when getOptionLabelProp returns undefined', () => {
    const fn = makeGetOptionLabel(() => undefined);
    expect(fn(makeItem('1'))).toBe('');
  });
});

// ---------------------------------------------------------------------------
// selectedText
// ---------------------------------------------------------------------------

/**
 * Recreates:
 *   const selectedText = multiple || !(field.value as T | '')
 *     ? ''
 *     : getOptionLabel(field.value as T);
 */
const computeSelectedText = (
  multiple: boolean,
  value: Item | null | undefined,
  getOptionLabel: (val: Item | string) => string
): string =>
  multiple || !value ? '' : getOptionLabel(value);

describe('selectedText', () => {
  const getOptionLabel = makeGetOptionLabel((item) => item.label);

  it('is empty string when multiple=true even with a value', () => {
    expect(computeSelectedText(true, makeItem('1', 'English'), getOptionLabel)).toBe('');
  });

  it('is empty string when value is null', () => {
    expect(computeSelectedText(false, null, getOptionLabel)).toBe('');
  });

  it('is empty string when value is undefined', () => {
    expect(computeSelectedText(false, undefined, getOptionLabel)).toBe('');
  });

  it('returns the option label when single-select and value is set', () => {
    expect(
      computeSelectedText(false, makeItem('1', 'Spanish'), getOptionLabel)
    ).toBe('Spanish');
  });
});

// ---------------------------------------------------------------------------
// open logic
// ---------------------------------------------------------------------------

/**
 * Recreates:
 *   const open =
 *     !!meta.active &&
 *     ((input && input !== selectedText) || (!input && !!initialOptions));
 */
const computeOpen = (
  active: boolean,
  input: string,
  selectedText: string,
  hasInitialOptions: boolean
): boolean =>
  active &&
  ((!!input && input !== selectedText) || (!input && hasInitialOptions));

describe('open logic', () => {
  it('is false when field is not active', () => {
    expect(computeOpen(false, 'Eng', '', false)).toBe(false);
  });

  it('is true when active and input differs from selectedText (searching)', () => {
    expect(computeOpen(true, 'Eng', '', false)).toBe(true);
  });

  it('is false when active but input equals selectedText (item already selected)', () => {
    expect(computeOpen(true, 'English', 'English', false)).toBe(false);
  });

  it('is true when active and input is empty but initialOptions exist', () => {
    expect(computeOpen(true, '', '', true)).toBe(true);
  });

  it('is false when active and input is empty and no initialOptions', () => {
    expect(computeOpen(true, '', '', false)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// options merging
// ---------------------------------------------------------------------------

/**
 * Recreates the useMemo inside LookupField that merges and deduplicates
 * search results, initial items, and the currently selected value(s).
 */
const mergeOptions = ({
  multiple,
  value,
  searchResults,
  initialItems,
  compareBy,
}: {
  multiple: boolean;
  value: Item | readonly Item[] | null;
  searchResults?: readonly Item[];
  initialItems?: readonly Item[];
  compareBy: (item: Item) => any;
}): Item[] => {
  const selected = multiple
    ? (value as readonly Item[]) ?? []
    : value
    ? [value as Item]
    : [];

  if (!searchResults?.length && !initialItems?.length) {
    return selected as Item[];
  }

  const merged = [
    ...(searchResults ?? []),
    ...(initialItems ?? []),
    ...selected,
  ];

  return uniqBy(merged, compareBy) as Item[];
};

describe('options merging', () => {
  it('returns only selected items when there are no search results or initial items', () => {
    const item = makeItem('1', 'English');
    const result = mergeOptions({
      multiple: false,
      value: item,
      compareBy: compareById,
    });
    expect(result).toEqual([item]);
  });

  it('returns empty array when no value, results, or initial items', () => {
    const result = mergeOptions({
      multiple: false,
      value: null,
      compareBy: compareById,
    });
    expect(result).toEqual([]);
  });

  it('merges search results with selected item', () => {
    const selected = makeItem('1', 'English');
    const fromSearch = makeItem('2', 'Spanish');
    const result = mergeOptions({
      multiple: false,
      value: selected,
      searchResults: [fromSearch],
      compareBy: compareById,
    });
    expect(result.map((i) => i.id)).toEqual(['2', '1']);
  });

  it('deduplicates selected item that also appears in search results', () => {
    const item = makeItem('1', 'English');
    const result = mergeOptions({
      multiple: false,
      value: item,
      searchResults: [item, makeItem('2', 'Spanish')],
      compareBy: compareById,
    });
    // id '1' should appear only once
    const ids = result.map((i) => i.id);
    expect(ids.filter((id) => id === '1')).toHaveLength(1);
  });

  it('merges initial items when no search results', () => {
    const initial = [makeItem('1'), makeItem('2')];
    const result = mergeOptions({
      multiple: false,
      value: null,
      initialItems: initial,
      compareBy: compareById,
    });
    expect(result.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('supports multiple selection: all selected items are included', () => {
    const selected = [makeItem('1'), makeItem('2')];
    const result = mergeOptions({
      multiple: true,
      value: selected,
      compareBy: compareById,
    });
    expect(result.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('deduplicates across search results and initial items', () => {
    const shared = makeItem('1', 'English');
    const result = mergeOptions({
      multiple: false,
      value: null,
      searchResults: [shared, makeItem('2')],
      initialItems: [shared, makeItem('3')],
      compareBy: compareById,
    });
    const ids = result.map((i) => i.id);
    expect(ids.filter((id) => id === '1')).toHaveLength(1);
    expect(ids).toContain('2');
    expect(ids).toContain('3');
  });
});

// ---------------------------------------------------------------------------
// filterOptions — sort + freeSolo append
// ---------------------------------------------------------------------------
//
// We only test the logic LookupField itself owns: applying sortComparator and
// conditionally appending the raw input string as a freeSolo option. MUI's
// own createFilterOptions text-filtering is intentionally not re-tested here.

/**
 * Recreates the two custom steps inside filterOptions:
 *   1. Apply sortComparator (if provided) to an already-filtered list.
 *   2. Append the raw inputValue as a string when freeSolo conditions are met.
 */
const applyFilterOptionsCustomLogic = ({
  options,
  inputValue,
  freeSolo = false,
  searchResultsLoading = false,
  sortComparator,
  getOptionLabel,
}: {
  options: Item[];
  inputValue: string;
  freeSolo?: boolean;
  searchResultsLoading?: boolean;
  sortComparator?: (a: Item, b: Item) => number;
  getOptionLabel: (val: Item | string) => string;
}): Array<Item | string> => {
  const sorted = sortComparator ? [...options].sort(sortComparator) : options;

  if (
    !freeSolo ||
    searchResultsLoading ||
    inputValue === '' ||
    sorted.map(getOptionLabel).includes(inputValue)
  ) {
    return sorted;
  }

  return [...sorted, inputValue];
};

describe('filterOptions custom logic', () => {
  const getOptionLabel = makeGetOptionLabel((item) => item.label);

  it('passes options through untouched when freeSolo is false', () => {
    const options = [makeItem('1', 'English'), makeItem('2', 'Spanish')];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: 'NewLang',
      freeSolo: false,
      getOptionLabel,
    });
    expect(result).toEqual(options);
  });

  it('appends raw inputValue as a string when freeSolo and no exact match', () => {
    const options = [makeItem('1', 'English')];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: 'NewLang',
      freeSolo: true,
      getOptionLabel,
    });
    expect(result[result.length - 1]).toBe('NewLang');
  });

  it('does not append when an exact label match exists', () => {
    const options = [makeItem('1', 'English')];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: 'English',
      freeSolo: true,
      getOptionLabel,
    });
    expect(result.every((o) => typeof o !== 'string')).toBe(true);
  });

  it('does not append when inputValue is empty', () => {
    const options = [makeItem('1', 'English')];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: '',
      freeSolo: true,
      getOptionLabel,
    });
    expect(result.every((o) => typeof o !== 'string')).toBe(true);
  });

  it('does not append when search is loading', () => {
    const options = [makeItem('1', 'English')];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: 'NewLang',
      freeSolo: true,
      searchResultsLoading: true,
      getOptionLabel,
    });
    expect(result.every((o) => typeof o !== 'string')).toBe(true);
  });

  it('applies sortComparator before the freeSolo-append check', () => {
    const sortComparator = (a: Item, b: Item) =>
      a.label.startsWith('Z') ? 1 : b.label.startsWith('Z') ? -1 : 0;

    const options = [
      makeItem('1', 'Zulu'),
      makeItem('2', 'Amharic'),
      makeItem('3', 'Bengali'),
    ];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: '',
      sortComparator,
      getOptionLabel,
    });
    const labels = result.map((o) => (typeof o === 'string' ? o : o.label));
    expect(labels[labels.length - 1]).toBe('Zulu');
  });

  it('sorts then appends freeSolo string at the very end', () => {
    const sortComparator = (a: Item, b: Item) =>
      a.label.startsWith('Z') ? 1 : b.label.startsWith('Z') ? -1 : 0;
    const options = [makeItem('1', 'Zulu'), makeItem('2', 'Amharic')];
    const result = applyFilterOptionsCustomLogic({
      options,
      inputValue: 'NewLang',
      freeSolo: true,
      sortComparator,
      getOptionLabel,
    });
    // Sorted: Amharic, Zulu — then freeSolo string appended last
    expect(result[result.length - 1]).toBe('NewLang');
    expect((result[result.length - 2] as Item).label).toBe('Zulu');
  });
});

// ---------------------------------------------------------------------------
// renderOption content selection
// ---------------------------------------------------------------------------

/**
 * Recreates the logic inside renderOption's <li>:
 *   typeof option === 'string'
 *     ? `Create "${option}"`
 *     : renderOptionContent
 *     ? renderOptionContent(option)
 *     : getOptionLabel(option)
 */
const resolveOptionContent = (
  option: Item | string,
  getOptionLabel: (val: Item | string) => string,
  renderOptionContent?: (option: Item) => React.ReactNode
// ai example Recreating renderOption content logic for unit-testable isolation
): React.ReactNode => {
  if (typeof option === 'string') return `Create "${option}"`;
  if (renderOptionContent) return renderOptionContent(option);
  return getOptionLabel(option);
};

describe('renderOption content', () => {
  const getOptionLabel = makeGetOptionLabel((item) => item.label);

  it('shows Create "X" label for a string option (freeSolo new item)', () => {
    const content = resolveOptionContent('NewLang', getOptionLabel);
    expect(content).toBe('Create "NewLang"');
  });

  it('delegates to renderOptionContent when provided', () => {
    const renderOptionContent = (item: Item) => (
      <span data-testid="custom">{item.label}</span>
    );
    const item = makeItem('1', 'English');
    const { getByTestId } = render(
      <>{resolveOptionContent(item, getOptionLabel, renderOptionContent)}</>
    );
    expect(getByTestId('custom')).toHaveTextContent('English');
  });

  it('falls back to getOptionLabel when renderOptionContent is not provided', () => {
    const item = makeItem('1', 'Spanish');
    const content = resolveOptionContent(item, getOptionLabel);
    expect(content).toBe('Spanish');
  });
});

// ---------------------------------------------------------------------------
// LookupField.createFor — displayName convention
// ---------------------------------------------------------------------------

/**
 * Recreates LookupField.createFor's displayName derivation:
 *   `Lookup(${upperFirst(camelCase(resource))})`
 */
const computeDisplayName = (resource: string) =>
  `Lookup(${upperFirst(camelCase(resource))})`;

describe('LookupField.createFor displayName', () => {
  it('produces Lookup(Language) for resource "Language"', () => {
    expect(computeDisplayName('Language')).toBe('Lookup(Language)');
  });

  it('camelCases multi-word resources', () => {
    expect(computeDisplayName('field-region')).toBe('Lookup(FieldRegion)');
  });

  it('handles already-camelCased resource names', () => {
    expect(computeDisplayName('fieldZone')).toBe('Lookup(FieldZone)');
  });
});

// ---------------------------------------------------------------------------
// isEqualBy / isListEqualBy (used by LookupField.createFor)
// ---------------------------------------------------------------------------

import { isEqualBy, isListEqualBy } from '../util';

describe('isEqualBy', () => {
  const isEqual = isEqualBy(compareById);

  it('returns true for two items with the same id', () => {
    expect(isEqual(makeItem('1', 'English'), makeItem('1', 'Updated'))).toBe(
      true
    );
  });

  it('returns false for two items with different ids', () => {
    expect(isEqual(makeItem('1'), makeItem('2'))).toBe(false);
  });

  it('returns false when one value is null', () => {
    expect(isEqual(makeItem('1'), null)).toBe(false);
  });
});

describe('isListEqualBy', () => {
  const isListEqual = isListEqualBy(compareById);

  it('returns true for lists with the same ids in any order', () => {
    expect(
      isListEqual([makeItem('1'), makeItem('2')], [makeItem('2'), makeItem('1')])
    ).toBe(true);
  });

  it('returns false when lists differ by one item', () => {
    expect(
      isListEqual([makeItem('1'), makeItem('2')], [makeItem('1'), makeItem('3')])
    ).toBe(false);
  });

  it('returns false for lists of different lengths', () => {
    expect(isListEqual([makeItem('1')], [makeItem('1'), makeItem('2')])).toBe(
      false
    );
  });

  it('returns true for two empty lists', () => {
    expect(isListEqual([], [])).toBe(true);
  });

  it('returns false when one list is null', () => {
    expect(isListEqual([makeItem('1')], null)).toBe(false);
  });
});
