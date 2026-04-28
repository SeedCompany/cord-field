import { useLazyQuery, useQuery } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import {
  Autocomplete,
  AutocompleteProps,
  Chip,
  ChipProps,
  CircularProgress,
  TextField,
  TextFieldProps,
  AutocompleteValue as Value,
} from '@mui/material';
import {
  // eslint-disable-next-line @seedcompany/no-restricted-imports
  createFilterOptions,
} from '@mui/material/Autocomplete';
import { camelCase, last, uniqBy, upperFirst } from 'lodash';
import {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Except, SetOptional, SetRequired } from 'type-fest';
import { isNetworkRequestInFlight, NoVars } from '~/api';
import { Power } from '~/api/schema.graphql';
import { useDialog } from '../../Dialog';
import { DialogFormProps } from '../../Dialog/DialogForm';
import { useSession } from '../../Session';
import { FieldConfig, useField } from '../useField';
import { getHelperText, isEqualBy, isListEqualBy, showError } from '../util';

interface QueryResult<T> {
  search: { items: ReadonlyArray<T | any> };
}

// ---------------------------------------------------------------------------
// Pure helpers — exported for unit testing in isolation
// ---------------------------------------------------------------------------

/** Returns true when the autocomplete popup should be open. */
export const computeIsOpen = (
  active: boolean,
  input: string,
  selectedText: string,
  hasInitialOptions: boolean
): boolean =>
  active &&
  ((!!input && input !== selectedText) || (!input && hasInitialOptions));

/** Merges search results, initial items, and current selection, deduplicating by compareBy. */
export const mergeOptions = <T,>({
  multiple,
  value,
  searchResults,
  initialItems,
  compareBy,
}: {
  multiple: boolean;
  value: T | readonly T[] | null;
  searchResults?: readonly T[];
  initialItems?: readonly T[];
  compareBy: (item: T) => unknown;
}): T[] => {
  const selected = multiple
    ? Array.isArray(value)
      ? value.slice()
      : ([] as T[])
    : value
    ? [value as T]
    : [];

  if (!searchResults?.length && !initialItems?.length) {
    return selected;
  }

  return uniqBy(
    [...(searchResults ?? []), ...(initialItems ?? []), ...selected],
    compareBy
  );
};

/** Applies caller-provided sort and optional freeSolo-append steps to an already-filtered option list. */
export const applyFilterOptionsCustomLogic = <T,>({
  options,
  inputValue,
  freeSolo = false,
  searchResultsLoading = false,
  sortComparator,
  getOptionLabel,
}: {
  options: T[];
  inputValue: string;
  freeSolo?: boolean;
  searchResultsLoading?: boolean;
  sortComparator?: (a: T, b: T) => number;
  getOptionLabel: (val: T | string) => string;
}): Array<T | string> => {
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

/** Resolves what content to render inside a single Autocomplete option <li>. */
export const resolveOptionContent = <T,>(
  option: T | string,
  getOptionLabel: (val: T | string) => string,
  renderOptionContent?: (option: T) => ReactNode
): ReactNode => {
  if (typeof option === 'string') return `Create "${option}"`;
  if (renderOptionContent) return renderOptionContent(option);
  return getOptionLabel(option);
};

/** Derives the displayName used by LookupField.createFor. */
export const computeLookupDisplayName = (resource: string): string =>
  `Lookup(${upperFirst(camelCase(resource))})`;

export type LookupFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  CreateFormValues
> = Except<
  SetRequired<FieldConfig<T, Multiple>, 'compareBy'>,
  'multiple' | 'allowNull' | 'parse' | 'format'
> &
  Pick<
    TextFieldProps,
    'helperText' | 'label' | 'autoFocus' | 'variant' | 'margin'
  > & {
    lookupDocument: DocumentNode<QueryResult<T>, { query: string }>;
    initialOptions?: { options?: readonly T[] };
    ChipProps?: ChipProps;
    CreateDialogForm?: ComponentType<
      Except<DialogFormProps<CreateFormValues, T>, 'onSubmit'>
    >;
    /** For create form. Poorly named. */
    getInitialValues?: (val: string) => Partial<CreateFormValues>;
    getOptionLabel: (option: T) => string | null | undefined;
    createPower?: Power;
    /** Render the content inside each option's <li> element instead of the default label. */
    renderOptionContent?: (option: T) => ReactNode;
    /** Sort visible options after filtering. Already-engaged items can be pushed to the bottom. */
    sortComparator?: (a: T, b: T) => number;
  } & Except<
    AutocompleteProps<T, Multiple, DisableClearable, false>,
    | 'value'
    | 'onChange'
    | 'defaultValue'
    | 'freeSolo'
    | 'renderInput'
    | 'renderTags'
    | 'loading'
    | 'filterSelectedOptions'
    | 'options'
    | 'ChipProps'
    | 'getOptionLabel'
  >;

export function LookupField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  CreateFormValues = never
>({
  multiple,
  defaultValue,
  lookupDocument,
  initialOptions,
  ChipProps,
  autoFocus,
  helperText,
  label,
  placeholder,
  required,
  CreateDialogForm,
  getInitialValues,
  compareBy,
  getOptionLabel: getOptionLabelProp,
  variant,
  createPower,
  margin,
  renderOptionContent,
  sortComparator,
  ...props
}: LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>) {
  const { powers } = useSession();
  const canCreate = createPower && powers?.includes(createPower);
  const freeSolo = !!CreateDialogForm && canCreate;
  type Val = Value<T, Multiple, DisableClearable, false>;

  const selectOnFocus = props.selectOnFocus ?? true;
  const andSelectOnFocus = useCallback(
    (el: HTMLDivElement) =>
      selectOnFocus &&
      el.tagName === 'INPUT' &&
      (el as unknown as HTMLInputElement).select(),
    [selectOnFocus]
  );

  const {
    input: field,
    meta,
    ref,
    rest: autocompleteProps,
  } = useField({
    ...props,
    required,
    multiple,
    allowNull: !multiple,
    defaultValue,
    compareBy,
    autoFocus,
    onFocus: andSelectOnFocus,
  });

  const getOptionLabel = (val: T | string) =>
    typeof val === 'string' ? val : getOptionLabelProp(val) ?? '';

  const selectedText =
    multiple || !(field.value as T | '')
      ? ''
      : getOptionLabel(field.value as T);

  const [input, setInput] = useState(selectedText);

  const [fetch, { data, networkStatus }] = useLazyQuery(lookupDocument, {
    notifyOnNetworkStatusChange: true,
  });
  // Not just for the first load, but every network request
  const searchResultsLoading = isNetworkRequestInFlight(networkStatus);
  const initialOptionsLoading = !!initialOptions && !initialOptions.options;

  const [createDialogState, createDialogItem, createInitialValues] =
    useDialog<Partial<CreateFormValues>>();

  useEffect(() => {
    setInput(selectedText);
  }, [field.value, selectedText]);

  useEffect(() => {
    if (input === '') {
      // don't fetch for no input (results will be hidden too)
      return;
    }
    if (!multiple && (field.value as Val | null) && input === selectedText) {
      return;
    }
    void fetch({
      variables: {
        query: input,
      },
    });
  }, [input, fetch, field.value, multiple, selectedText]);

  // Only open the popup if focused and
  // (searching for an item or have initial options).
  const open = computeIsOpen(
    !!meta.active,
    input,
    selectedText,
    !!initialOptions
  );

  // Augment results with currently selected items to indicate that
  // they are still valid (and to prevent MUI warning)
  const options = useMemo(
    () =>
      mergeOptions({
        multiple: !!multiple,
        value: field.value as T | readonly T[] | null,
        searchResults: data?.search.items,
        initialItems: initialOptions?.options,
        compareBy,
      }),
    [
      data?.search.items,
      initialOptions?.options,
      field.value,
      compareBy,
      multiple,
    ]
  );

  const autocomplete = (
    <Autocomplete<T, Multiple, DisableClearable, typeof freeSolo>
      isOptionEqualToValue={(a, b) => compareBy(a) === compareBy(b)}
      loadingText={<CircularProgress size={16} />}
      // Otherwise it looks like an item is selected when it's just a search value
      clearOnBlur
      // Auto highlight the first option so a valid lookup item isn't
      // interrupted as free solo selection
      autoHighlight
      // Helps represent that this is a valid object & makes it easier to replace
      // Works well with clearOnBlur
      selectOnFocus
      {...autocompleteProps}
      disabled={meta.disabled}
      // FF also has multiple and defaultValue
      multiple={multiple}
      renderTags={(values: T[], getTagProps) =>
        values.map((option: T, index: number) => (
          <Chip
            variant="outlined"
            {...ChipProps}
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      options={options}
      getOptionLabel={getOptionLabel}
      freeSolo={freeSolo}
      renderOption={(props, option, _ownerState) => (
        <li {...props}>
          {resolveOptionContent(option, getOptionLabel, renderOptionContent)}
        </li>
      )}
      filterOptions={(options, params) => {
        // Apply default MUI text filtering first. Even though the API filters for
        // us, we add selected options back and need to hide unrelated ones.
        const filtered = createFilterOptions<T>()(options, params);

        // Apply sort + optional freeSolo-append via the extracted helper.
        return applyFilterOptionsCustomLogic({
          options: filtered,
          inputValue: params.inputValue,
          freeSolo,
          searchResultsLoading,
          sortComparator,
          getOptionLabel,
        }) as T[];
      }}
      // FF for some reason doesn't handle defaultValue correctly
      value={((field.value as Val | null) || meta.defaultValue) as Val}
      inputValue={input}
      onBlur={field.onBlur}
      onFocus={field.onFocus}
      onKeyDown={(event) => {
        // Prevent submitting the form while searching, user is probably trying
        // to execute search (which happens automatically).
        if (event.key === 'Enter' && searchResultsLoading)
          event.preventDefault();
      }}
      onInputChange={(_, val) => {
        setInput(val);
      }}
      onChange={(_, value) => {
        const lastItem = multiple ? last(value as T[]) : value;
        if (typeof lastItem === 'string' && freeSolo) {
          if (searchResultsLoading) {
            // Prevent creating while loading
            return;
          }
          const initialValues: Partial<CreateFormValues> = getInitialValues
            ? getInitialValues(lastItem)
            : {};
          createDialogItem(initialValues);
          // Don't store the new value as a string in FF.
          // Wait until it is successfully created and returned from the API.
          return;
        }
        field.onChange(value);
      }}
      loading={searchResultsLoading || initialOptionsLoading}
      open={open}
      forcePopupIcon={!open ? false : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          // no asterisk
          InputLabelProps={{ ...params.InputLabelProps, required: false }}
          label={label}
          placeholder={placeholder}
          helperText={getHelperText(meta, helperText)}
          required={required}
          inputRef={ref}
          error={showError(meta)}
          autoFocus={autoFocus}
          focused={meta.focused}
          variant={variant}
          margin={margin}
        />
      )}
    />
  );
  return (
    <>
      {autocomplete}
      {CreateDialogForm && (
        <CreateDialogForm
          {...createDialogState}
          initialValues={createInitialValues}
          sendIfClean={true}
          onSuccess={(newItem: T) => {
            field.onChange(
              multiple ? [...(field.value as readonly T[]), newItem] : newItem
            );
          }}
        />
      )}
    </>
  );
}

interface StandardNamedObject {
  readonly name: { readonly value?: string | null };
}

type SetOptionalIf<
  T,
  Keys extends keyof T,
  Subject,
  Condition
> = Subject extends Condition ? SetOptional<T, Keys> : T;

LookupField.createFor = <
  T extends { id: string },
  CreateFormValues = never,
  InitialOptionsQueryResult = never
>({
  resource,
  initial,
  ...config
}: SetOptionalIf<
  SetOptional<
    Except<
      LookupFieldProps<T, any, any, CreateFormValues>,
      'value' | 'defaultValue'
    >,
    'name' | 'compareBy'
  >,
  'getOptionLabel',
  T,
  StandardNamedObject
> & {
  resource: string;
  initial?: [
    query: DocumentNode<InitialOptionsQueryResult, NoVars>,
    selector: (result: InitialOptionsQueryResult) => readonly T[]
  ];
}) => {
  const compareBy = config.compareBy ?? ((item: T) => item.id);
  const useInitialOptions = initial
    ? () => {
        const [query, selector] = initial;
        const res = useQuery(query);
        const options = res.data ? selector(res.data) : undefined;
        return { options };
      }
    : undefined;
  const Comp = function <
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined
  >(
    props: Except<
      LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>,
      'lookupDocument' | 'compareBy' | 'getOptionLabel'
    >
  ) {
    const initialOptions = useInitialOptions?.();
    return (
      <LookupField<T, Multiple, DisableClearable, CreateFormValues>
        compareBy={compareBy}
        getOptionLabel={(item: StandardNamedObject) => item.name.value}
        createPower={`Create${resource}` as Power}
        initialOptions={initialOptions}
        {...(config as any)}
        {...props}
      />
    );
  };
  Comp.displayName = computeLookupDisplayName(resource);
  Comp.isEqual = isEqualBy(compareBy);
  Comp.isListEqual = isListEqualBy(compareBy);
  return Comp;
};
