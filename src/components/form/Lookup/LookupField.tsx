import { useLazyQuery } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import {
  Chip,
  ChipProps,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteProps,
  createFilterOptions,
  Value,
} from '@material-ui/lab';
import { camelCase } from 'camel-case';
import { last, uniqBy, upperFirst } from 'lodash';
import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Except, SetOptional } from 'type-fest';
import { isNetworkRequestInFlight, Power } from '../../../api';
import { useDialog } from '../../Dialog';
import { DialogFormProps } from '../../Dialog/DialogForm';
import { useSession } from '../../Session';
import { FieldConfig, useField, useFieldName } from '../index';
import {
  getHelperText,
  isEqualBy,
  isListEqualBy,
  showError,
  useFocusOnEnabled,
} from '../util';

interface QueryResult<T> {
  search: { items: ReadonlyArray<T | any> };
}

export type LookupFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  CreateFormValues
> = Except<
  FieldConfig<Value<T, Multiple, DisableClearable, false>>,
  'multiple' | 'allowNull' | 'parse' | 'format'
> &
  Pick<
    TextFieldProps,
    'helperText' | 'label' | 'required' | 'autoFocus' | 'variant'
  > & {
    name: string;
    lookupDocument: DocumentNode<QueryResult<T>, { query: string }>;
    getCompareBy: (item: T) => any;
    ChipProps?: ChipProps;
    CreateDialogForm?: ComponentType<
      Except<DialogFormProps<CreateFormValues, T>, 'onSubmit'>
    >;
    getInitialValues?: (val: string) => Partial<CreateFormValues>;
    getOptionLabel: (option: T) => string | null | undefined;
    createPower?: Power;
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

const emptyArray = [] as const;

export function LookupField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  CreateFormValues = never
>({
  name: nameProp,
  multiple,
  defaultValue: defaultValueProp,
  disabled: disabledProp,
  lookupDocument,
  ChipProps,
  autoFocus,
  helperText,
  label,
  placeholder,
  required,
  CreateDialogForm,
  getInitialValues,
  getCompareBy,
  getOptionLabel: getOptionLabelProp,
  variant,
  createPower,
  ...props
}: LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>) {
  const { powers } = useSession();
  const canCreate = createPower && powers?.includes(createPower);
  const freeSolo = !!CreateDialogForm && canCreate;
  type Val = Value<T, Multiple, DisableClearable, false>;
  const defaultValue =
    defaultValueProp ?? ((multiple ? emptyArray : null) as Val);

  const name = useFieldName(nameProp);
  const { input: field, meta, rest: autocompleteProps } = useField<Val>(name, {
    ...props,
    required,
    allowNull: !multiple,
    defaultValue,
    isEqual: multiple ? isListEqualBy(getCompareBy) : isEqualBy(getCompareBy),
  });
  const disabled = disabledProp ?? meta.submitting;

  const selectOnFocus = props.selectOnFocus ?? true;
  const andSelectOnFocus = useCallback((el) => selectOnFocus && el.select(), [
    selectOnFocus,
  ]);
  const ref = useFocusOnEnabled<HTMLInputElement>(
    meta,
    disabled,
    andSelectOnFocus
  );

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
  // Not just for first load, but every network request
  const loading = isNetworkRequestInFlight(networkStatus);

  const [createDialogState, createDialogItem, createInitialValues] = useDialog<
    Partial<CreateFormValues>
  >();

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
    fetch({
      variables: {
        query: input,
      },
    });
  }, [input, fetch, field.value, multiple, selectedText]);

  // Only open popup if searching for item & focused
  const open = Boolean(input) && input !== selectedText && meta.active;

  // Augment results with currently selected items to indicate that
  // they are still valid (and to prevent MUI warning)
  const options = useMemo(() => {
    const selected = multiple
      ? (field.value as T[])
      : (field.value as T | null)
      ? [field.value as T]
      : [];
    if (!data?.search.items.length) {
      return selected; // optimization for no results
    }

    const resultsWithCurrent = [...data.search.items, ...selected];

    // Filter out duplicates caused by selected items also appearing in search results.
    return uniqBy(resultsWithCurrent, getCompareBy);
  }, [data?.search.items, field.value, getCompareBy, multiple]);

  const autocomplete = (
    <Autocomplete<T, Multiple, DisableClearable, typeof freeSolo>
      getOptionSelected={(a, b) => getCompareBy(a) === getCompareBy(b)}
      loadingText={<CircularProgress size={16} />}
      // Otherwise it looks like an item is selected when it's just a search value
      clearOnBlur
      // Auto highlight the first option so a valid lookup item isn't
      // interrupted as free solo selection
      autoHighlight
      // Helps represent that his is a valid object & makes it easier to replace
      // Works well with clearOnBlur
      selectOnFocus
      {...autocompleteProps}
      disabled={disabled}
      // FF also has multiple and defaultValue
      multiple={multiple}
      renderTags={(values: T[], getTagProps) =>
        values.map((option: T, index: number) => (
          <Chip
            variant="outlined"
            {...ChipProps}
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
          />
        ))
      }
      options={options}
      getOptionLabel={getOptionLabel}
      freeSolo={freeSolo}
      renderOption={(option) => {
        if (typeof option === 'string') {
          return `Add "${option}"`;
        }
        return getOptionLabel(option);
      }}
      filterOptions={(options, params) => {
        // Apply default filtering. Even though the API filters for us, we add
        // the currently selected options back in because they are still valid
        // but we don't want to show these options if the don't match the
        // current input text.
        // Note: `filterSelectedOptions` could still make sense either way
        // separate from this code below. It could be thought of as a "stricter"
        // filter that not only removes unrelated results but also related
        // results that have already been selected.
        const filtered = createFilterOptions<T>()(options, params);

        if (
          !freeSolo ||
          loading || // item could be returned with request in flight
          params.inputValue === '' ||
          filtered.map(getOptionLabel).includes(params.inputValue)
        ) {
          return filtered;
        }

        // If freeSolo is enabled and the input value doesn't match an existing
        // or previously selected option, add it to the list. i.e. 'Add "X"'.
        return [
          ...filtered,
          // @ts-expect-error We want to allow strings for new options,
          // which may differ from T. We handle them in renderOption.
          params.inputValue as T,
        ];
      }}
      // FF for some reason doesn't handle defaultValue correctly
      value={(field.value as Val | '') || defaultValue}
      inputValue={input}
      onBlur={field.onBlur}
      onFocus={field.onFocus}
      onKeyDown={(event) => {
        // Prevent submitting form while searching, user is probably trying
        // to execute search (which happens automatically).
        if (event.key === 'Enter' && loading) event.preventDefault();
      }}
      onInputChange={(_, val) => {
        setInput(val);
      }}
      onChange={(_, value) => {
        const lastItem = multiple ? last(value as T[]) : value;
        if (typeof lastItem === 'string' && freeSolo) {
          if (loading) {
            // Prevent creating while loading
            return;
          }
          const initialValues: Partial<CreateFormValues> = getInitialValues
            ? getInitialValues(lastItem)
            : {};
          createDialogItem(initialValues);
          // Don't store the new value as a string in FF.
          // Wait till it's successfully created and returned from the API.
          return;
        }
        field.onChange(value);
      }}
      loading={loading}
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
          variant={variant}
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
              multiple ? [...(field.value as T[]), newItem] : newItem
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

LookupField.createFor = <T extends { id: string }, CreateFormValues = never>({
  resource,
  ...config
}: SetOptionalIf<
  SetOptional<
    Except<
      LookupFieldProps<T, any, any, CreateFormValues>,
      'value' | 'defaultValue'
    >,
    'name' | 'getCompareBy'
  >,
  'getOptionLabel',
  T,
  StandardNamedObject
> & {
  resource: string;
}) => {
  const compareBy = config.getCompareBy ?? ((item: T) => item.id);
  const Comp = function <
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined
  >(
    props: Except<
      LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>,
      'lookupDocument' | 'getCompareBy' | 'getOptionLabel'
    >
  ) {
    return (
      <LookupField<T, Multiple, DisableClearable, CreateFormValues>
        getCompareBy={compareBy}
        getOptionLabel={(item: StandardNamedObject) => item.name.value}
        createPower={`Create${resource}` as Power}
        {...(config as any)}
        {...props}
      />
    );
  };
  Comp.displayName = `Lookup(${upperFirst(camelCase(resource))})`;
  Comp.isEqual = isEqualBy(compareBy);
  Comp.isListEqual = isListEqualBy(compareBy);
  return Comp;
};
