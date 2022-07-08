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
import { camelCase, last, uniqBy, upperFirst } from 'lodash';
import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Except, SetOptional, SetRequired } from 'type-fest';
import { isNetworkRequestInFlight } from '~/api';
import { Power } from '~/api/schema.graphql';
import { useDialog } from '../../Dialog';
import { DialogFormProps } from '../../Dialog/DialogForm';
import { useSession } from '../../Session';
import { FieldConfig, useField } from '../useField';
import { getHelperText, isEqualBy, isListEqualBy, showError } from '../util';

interface QueryResult<T> {
  search: { items: ReadonlyArray<T | any> };
}

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

export function LookupField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  CreateFormValues = never
>({
  multiple,
  defaultValue,
  lookupDocument,
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
  ...props
}: LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>) {
  const { powers } = useSession();
  const canCreate = createPower && powers?.includes(createPower);
  const freeSolo = !!CreateDialogForm && canCreate;
  type Val = Value<T, Multiple, DisableClearable, false>;

  const selectOnFocus = props.selectOnFocus ?? true;
  const andSelectOnFocus = useCallback(
    (el) => selectOnFocus && el.select(),
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
  // Not just for first load, but every network request
  const loading = isNetworkRequestInFlight(networkStatus);

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

  // Only open popup if searching for item & focused
  const open = Boolean(input) && input !== selectedText && meta.active;

  // Augment results with currently selected items to indicate that
  // they are still valid (and to prevent MUI warning)
  const options = useMemo(() => {
    const selected = multiple
      ? (field.value as readonly T[])
      : (field.value as T | null)
      ? [field.value as T]
      : [];
    if (!data?.search.items.length) {
      return selected; // optimization for no results
    }

    const resultsWithCurrent = [...data.search.items, ...selected];

    // Filter out duplicates caused by selected items also appearing in search results.
    return uniqBy(resultsWithCurrent, compareBy);
  }, [data?.search.items, field.value, compareBy, multiple]);

  const autocomplete = (
    <Autocomplete<T, Multiple, DisableClearable, typeof freeSolo>
      getOptionSelected={(a, b) => compareBy(a) === compareBy(b)}
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
          />
        ))
      }
      // @ts-expect-error our value is readonly array, MUI's is not but it could be.
      options={options}
      getOptionLabel={getOptionLabel}
      freeSolo={freeSolo}
      renderOption={(option) => {
        if (typeof option === 'string') {
          return `Create "${option}"`;
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
      value={((field.value as Val | null) || meta.defaultValue) as Val}
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

LookupField.createFor = <T extends { id: string }, CreateFormValues = never>({
  resource,
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
}) => {
  const compareBy = config.compareBy ?? ((item: T) => item.id);
  const Comp = function <
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined
  >(
    props: Except<
      LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>,
      'lookupDocument' | 'compareBy' | 'getOptionLabel'
    >
  ) {
    return (
      <LookupField<T, Multiple, DisableClearable, CreateFormValues>
        compareBy={compareBy}
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
