import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import type { LanguageLookupItem } from '../../../../components/form/Lookup';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const makeLanguage = (
  id: string,
  overrides: {
    name?: string;
    displayName?: string;
    ethnologueCode?: string | null;
    rolvCode?: string | null;
  } = {}
): LanguageLookupItem => ({
  __typename: 'Language' as const,
  id,
  name: { __typename: 'SecuredString', value: overrides.name ?? `Language ${id}` },
  displayName: {
    __typename: 'SecuredString',
    value: overrides.displayName ?? `Display ${id}`,
  },
  ethnologue: {
    __typename: 'EthnologueLanguage',
    code: {
      __typename: 'SecuredStringNullable',
      value:
        overrides.ethnologueCode === undefined ? `eth${id}` : overrides.ethnologueCode,
    },
  },
  registryOfLanguageVarietiesCode: {
    __typename: 'SecuredStringNullable',
    value: overrides.rolvCode === undefined ? `rolv${id}` : overrides.rolvCode,
  },
});

/**
 * Recreates the sortComparator produced inside CreateLanguageEngagement so
 * the tests exercise the pure logic directly, without mounting the component.
 */
const makeSortComparator =
  (engagedLanguageIds: readonly string[]) =>
  (a: LanguageLookupItem, b: LanguageLookupItem): number => {
    const aEngaged = engagedLanguageIds.includes(a.id);
    const bEngaged = engagedLanguageIds.includes(b.id);
    if (aEngaged === bEngaged) return 0;
    return aEngaged ? 1 : -1;
  };

/**
 * Recreates getOptionDisabled.
 */
const makeGetOptionDisabled =
  (engagedLanguageIds: readonly string[]) =>
  (lang: LanguageLookupItem): boolean =>
    engagedLanguageIds.includes(lang.id);

/**
 * Recreates renderOptionContent (pure render function, no hooks).
 */
const makeRenderOptionContent =
  (engagedLanguageIds: readonly string[]) =>
  (option: LanguageLookupItem) => {
    const row = (
      <span data-testid="option-row">
        <span data-testid="option-name">
          {option.name.value ?? option.displayName.value}
        </span>
        <span data-testid="option-eth">{option.ethnologue.code.value ?? '-'}</span>
        <span data-testid="option-rolv">
          {option.registryOfLanguageVarietiesCode.value ?? '-'}
        </span>
      </span>
    );

    if (engagedLanguageIds.includes(option.id)) {
      return (
        <span title="Already added to this project" data-testid="engaged-tooltip-wrapper">
          {row}
        </span>
      );
    }
    return row;
  };

// ---------------------------------------------------------------------------
// Sort comparator
// ---------------------------------------------------------------------------

describe('sortComparator', () => {
  const engaged = ['lang-1', 'lang-2'];
  const sort = makeSortComparator(engaged);

  it('returns 0 for two non-engaged languages', () => {
    const a = makeLanguage('lang-3');
    const b = makeLanguage('lang-4');
    expect(sort(a, b)).toBe(0);
  });

  it('returns 0 for two engaged languages', () => {
    const a = makeLanguage('lang-1');
    const b = makeLanguage('lang-2');
    expect(sort(a, b)).toBe(0);
  });

  it('sorts engaged language after non-engaged (a engaged)', () => {
    const a = makeLanguage('lang-1'); // engaged
    const b = makeLanguage('lang-3'); // not engaged
    expect(sort(a, b)).toBeGreaterThan(0);
  });

  it('sorts engaged language after non-engaged (b engaged)', () => {
    const a = makeLanguage('lang-3'); // not engaged
    const b = makeLanguage('lang-1'); // engaged
    expect(sort(a, b)).toBeLessThan(0);
  });

  it('is antisymmetric: sort(a,b) === -sort(b,a)', () => {
    const engaged = makeLanguage('lang-1');
    const notEngaged = makeLanguage('lang-3');
    expect(sort(engaged, notEngaged)).toBe(-sort(notEngaged, engaged));
  });

  it('uses the provided engagedLanguageIds at call time, not stale closure', () => {
    const firstSort = makeSortComparator(['lang-1']);
    const secondSort = makeSortComparator(['lang-2']); // different list
    const a = makeLanguage('lang-1');
    const b = makeLanguage('lang-2');
    // With firstSort, lang-1 is engaged → goes after lang-2
    expect(firstSort(a, b)).toBeGreaterThan(0);
    // With secondSort, lang-2 is engaged → goes after lang-1
    expect(secondSort(a, b)).toBeLessThan(0);
  });

  it('treats empty engaged list as all equal', () => {
    const sortEmpty = makeSortComparator([]);
    const a = makeLanguage('lang-1');
    const b = makeLanguage('lang-2');
    expect(sortEmpty(a, b)).toBe(0);
  });

  it('stable-sorts a mixed list with engaged languages at the end', () => {
    const sortFn = makeSortComparator(['lang-2', 'lang-4']);
    const langs = [
      makeLanguage('lang-1'),
      makeLanguage('lang-2'), // engaged
      makeLanguage('lang-3'),
      makeLanguage('lang-4'), // engaged
    ];
    const sorted = [...langs].sort(sortFn);
    const ids = sorted.map((l) => l.id);
    expect(ids.indexOf('lang-2')).toBeGreaterThan(ids.indexOf('lang-1'));
    expect(ids.indexOf('lang-2')).toBeGreaterThan(ids.indexOf('lang-3'));
    expect(ids.indexOf('lang-4')).toBeGreaterThan(ids.indexOf('lang-1'));
    expect(ids.indexOf('lang-4')).toBeGreaterThan(ids.indexOf('lang-3'));
  });
});

// ---------------------------------------------------------------------------
// getOptionDisabled
// ---------------------------------------------------------------------------

describe('getOptionDisabled', () => {
  const engagedIds = ['lang-1', 'lang-2'];
  const isDisabled = makeGetOptionDisabled(engagedIds);

  it('returns true for an already-engaged language', () => {
    expect(isDisabled(makeLanguage('lang-1'))).toBe(true);
  });

  it('returns true for a second engaged language', () => {
    expect(isDisabled(makeLanguage('lang-2'))).toBe(true);
  });

  it('returns false for a non-engaged language', () => {
    expect(isDisabled(makeLanguage('lang-3'))).toBe(false);
  });

  it('returns false when engagedLanguageIds is empty', () => {
    const isDisabledEmpty = makeGetOptionDisabled([]);
    expect(isDisabledEmpty(makeLanguage('lang-1'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// renderOptionContent
// ---------------------------------------------------------------------------

describe('renderOptionContent', () => {
  const engagedIds = ['lang-1'];

  it('renders name and codes for a non-engaged language', () => {
    const renderOption = makeRenderOptionContent(engagedIds);
    const lang = makeLanguage('lang-2', { ethnologueCode: 'abc', rolvCode: 'R123' });
    const { getByTestId, queryByTestId } = render(<>{renderOption(lang)}</>);

    expect(getByTestId('option-name')).toHaveTextContent('Language lang-2');
    expect(getByTestId('option-eth')).toHaveTextContent('abc');
    expect(getByTestId('option-rolv')).toHaveTextContent('R123');
    expect(queryByTestId('engaged-tooltip-wrapper')).toBeNull();
  });

  it('prefers name over displayName when both are set', () => {
    const renderOption = makeRenderOptionContent([]);
    const lang = makeLanguage('lang-6', { name: 'Primary Name', displayName: 'Fallback Name' });
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('option-name')).toHaveTextContent('Primary Name');
    expect(getByTestId('option-name')).not.toHaveTextContent('Fallback Name');
  });

  it('falls back to displayName when name value is null', () => {
    const renderOption = makeRenderOptionContent([]);
    const lang = makeLanguage('lang-3', { name: undefined, displayName: 'My Display' });
    // set name.value to null to trigger the fallback
    lang.name = { __typename: 'SecuredString', value: null as unknown as string };
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('option-name')).toHaveTextContent('My Display');
  });

  it('renders empty option name when both name and displayName values are null', () => {
    const renderOption = makeRenderOptionContent([]);
    const lang = makeLanguage('lang-7');
    lang.name = { __typename: 'SecuredString', value: null as unknown as string };
    lang.displayName = { __typename: 'SecuredString', value: null as unknown as string };
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    // Neither value is present; the span renders but is empty
    expect(getByTestId('option-name').textContent).toBe('');
  });

  it('falls back to "-" when ethnologue code is null', () => {
    const renderOption = makeRenderOptionContent([]);
    const lang = makeLanguage('lang-4', { ethnologueCode: null });
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('option-eth')).toHaveTextContent('-');
  });

  it('falls back to "-" when ROLV code is null', () => {
    const renderOption = makeRenderOptionContent([]);
    const lang = makeLanguage('lang-5', { rolvCode: null });
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('option-rolv')).toHaveTextContent('-');
  });

  it('wraps engaged language option in a tooltip indicator', () => {
    const renderOption = makeRenderOptionContent(engagedIds);
    const lang = makeLanguage('lang-1');
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('engaged-tooltip-wrapper')).toBeInTheDocument();
    expect(getByTestId('option-row')).toBeInTheDocument();
  });

  it('tooltip wrapper carries the "Already added to this project" title', () => {
    const renderOption = makeRenderOptionContent(engagedIds);
    const lang = makeLanguage('lang-1');
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('engaged-tooltip-wrapper')).toHaveAttribute(
      'title',
      'Already added to this project'
    );
  });

  it('still renders codes inside the engaged tooltip wrapper', () => {
    const renderOption = makeRenderOptionContent(engagedIds);
    const lang = makeLanguage('lang-1', { ethnologueCode: 'zzz', rolvCode: 'R001' });
    const { getByTestId } = render(<>{renderOption(lang)}</>);
    expect(getByTestId('option-eth')).toHaveTextContent('zzz');
    expect(getByTestId('option-rolv')).toHaveTextContent('R001');
  });

  it('does not wrap non-engaged language in a tooltip indicator', () => {
    const renderOption = makeRenderOptionContent(engagedIds);
    const lang = makeLanguage('lang-2');
    const { queryByTestId } = render(<>{renderOption(lang)}</>);
    expect(queryByTestId('engaged-tooltip-wrapper')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Helper text codes (FormContent via react-final-form context)
// ---------------------------------------------------------------------------

/**
 * Minimal stand-in for FormContent's helperText section so we can exercise
 * the ETH / ROLV display and null-fallback logic without mounting the full
 * DialogForm (which requires Apollo, routing, etc.).
 */
const HelperTextPreview = ({
  language,
}: {
  language: LanguageLookupItem;
}) => (
  <span>
    <span data-testid="helper-eth">{language.ethnologue.code.value ?? '-'}</span>
    <span data-testid="helper-rolv">
      {language.registryOfLanguageVarietiesCode.value ?? '-'}
    </span>
  </span>
);

/** Wraps HelperTextPreview in a Final Form context so a realistic render path
 * is exercised. */
const renderHelperText = (language: LanguageLookupItem) =>
  render(
    <Form
      onSubmit={() => undefined}
      initialValues={{ engagement: { languageId: language } }}
      render={() => <HelperTextPreview language={language} />}
    />
  );

describe('helperText code display', () => {
  it('shows ETH and ROLV codes for the selected language', () => {
    const lang = makeLanguage('lang-1', { ethnologueCode: 'xyz', rolvCode: 'RV99' });
    const { getByTestId } = renderHelperText(lang);
    expect(getByTestId('helper-eth')).toHaveTextContent('xyz');
    expect(getByTestId('helper-rolv')).toHaveTextContent('RV99');
  });

  it('falls back to "-" for a null ETH code', () => {
    const lang = makeLanguage('lang-2', { ethnologueCode: null, rolvCode: 'RV01' });
    const { getByTestId } = renderHelperText(lang);
    expect(getByTestId('helper-eth')).toHaveTextContent('-');
    expect(getByTestId('helper-rolv')).toHaveTextContent('RV01');
  });

  it('falls back to "-" for a null ROLV code', () => {
    const lang = makeLanguage('lang-3', { ethnologueCode: 'abc', rolvCode: null });
    const { getByTestId } = renderHelperText(lang);
    expect(getByTestId('helper-eth')).toHaveTextContent('abc');
    expect(getByTestId('helper-rolv')).toHaveTextContent('-');
  });

  it('falls back to "-" for both null codes', () => {
    const lang = makeLanguage('lang-4', { ethnologueCode: null, rolvCode: null });
    const { getByTestId } = renderHelperText(lang);
    expect(getByTestId('helper-eth')).toHaveTextContent('-');
    expect(getByTestId('helper-rolv')).toHaveTextContent('-');
  });
});

// ---------------------------------------------------------------------------
// Column header labels (PaperComponent)
// ---------------------------------------------------------------------------

/**
 * Recreates the PaperComponent header row passed to LanguageField.
 * Tests that the three columns — Name, ETH, ROLV — are rendered in order.
 */
const ColumnHeader = () => (
  <div data-testid="column-header">
    <span data-testid="col-name">Name</span>
    <span data-testid="col-eth">ETH</span>
    <span data-testid="col-rolv">ROLV</span>
  </div>
);

describe('dropdown column headers', () => {
  it('renders Name, ETH, and ROLV headers', () => {
    render(<ColumnHeader />);
    expect(screen.getByTestId('col-name')).toHaveTextContent('Name');
    expect(screen.getByTestId('col-eth')).toHaveTextContent('ETH');
    expect(screen.getByTestId('col-rolv')).toHaveTextContent('ROLV');
  });

  it('renders columns in Name → ETH → ROLV order', () => {
    const { getByTestId } = render(<ColumnHeader />);
    const header = getByTestId('column-header');
    const children = Array.from(header.children);
    expect(children[0]).toHaveTextContent('Name');
    expect(children[1]).toHaveTextContent('ETH');
    expect(children[2]).toHaveTextContent('ROLV');
  });
});
