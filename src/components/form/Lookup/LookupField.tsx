import { LazyQueryHookOptions, QueryTuple } from '@apollo/client';
import {
  Chip,
  ChipProps,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { Autocomplete, AutocompleteProps, Value } from '@material-ui/lab';
import { camelCase } from 'camel-case';
import { last, upperFirst } from 'lodash';
import React, { ComponentType, useCallback, useEffect, useState } from 'react';
import { Except, Merge, SetOptional } from 'type-fest';
import { isNetworkRequestInFlight } from '../../../api';
import { useDialog } from '../../Dialog';
import { DialogFormProps } from '../../Dialog/DialogForm';
import { FieldConfig, useField, useFieldName } from '../index';
import {
  areListsEqual,
  compareNullable,
  getHelperText,
  showError,
  useFocusOnEnabled,
} from '../util';

interface QueryResult<T> {
  search: { items: ReadonlyArray<T | any> };
}
interface QueryVars {
  query: string;
}
type LookupQueryHook<T> = (
  baseOptions?: LazyQueryHookOptions<QueryResult<T>, QueryVars>
) => QueryTuple<QueryResult<T>, QueryVars>;

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
    useLookup: LookupQueryHook<T>;
    getCompareBy: (item: T) => any;
    ChipProps?: ChipProps;
    CreateDialogForm?: ComponentType<
      Except<DialogFormProps<CreateFormValues, T>, 'onSubmit'>
    >;
    getInitialValues?: (val: string) => Partial<CreateFormValues>;
    getOptionLabel: (option: T) => string | null | undefined;
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
  useLookup,
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
  ...props
}: LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>) {
  const freeSolo = !!CreateDialogForm;
  type Val = Value<T, Multiple, DisableClearable, false>;
  const defaultValue =
    defaultValueProp ?? ((multiple ? emptyArray : null) as Val);

  const name = useFieldName(nameProp);
  const { input: field, meta, rest: autocompleteProps } = useField<Val>(name, {
    ...props,
    required,
    allowNull: !multiple,
    defaultValue,
    isEqual: compareNullable((a, b) =>
      multiple
        ? areListsEqual(a.map(getCompareBy), b.map(getCompareBy))
        : getCompareBy(a) === getCompareBy(b)
    ),
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

  const [fetch, { data, networkStatus }] = useLookup({
    notifyOnNetworkStatusChange: true,
  });
  // Not just for first load, but every network request
  const loading = isNetworkRequestInFlight(networkStatus);

  const [createDialogState, createDialogItem, createDialogValue] = useDialog<
    string
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

  const options = [
    ...(data?.search.items ?? []),
    // Add currently selected items to options so prevent MUI warning
    // They will be hidden via filterSelectedOptions
    ...((multiple ? field.value : []) as T[]),
  ];
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
      // if we only have one value that can and has been selected, we don't
      // want to hide it in the dropdown if we start deleting characters
      filterSelectedOptions={multiple || input === selectedText}
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
        // If freeSolo we can add new options i.e. 'Add "X"'.
        if (!freeSolo || loading) return options;

        const allOptions = [
          ...options,
          // selected option(s)
          ...(multiple ? (field.value as T[]) : []),
        ];

        const allLabels = allOptions.map(getOptionLabel);

        if (params.inputValue === '' || allLabels.includes(params.inputValue)) {
          return options;
        }
        // If the freeSolo value doesn't match an existing or previously selected option, add it to the list.
        return [
          ...options,
          // @ts-expect-error We want to allow strings for new options, which may differ from T.
          // We handle them in renderOption.
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
          createDialogItem(lastItem);
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
          initialValues={
            getInitialValues && createDialogValue
              ? getInitialValues(createDialogValue)
              : undefined
          }
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
}: Merge<
  Except<
    SetOptionalIf<
      SetOptional<
        LookupFieldProps<T, any, any, CreateFormValues>,
        'name' | 'getCompareBy'
      >,
      'getOptionLabel',
      T,
      StandardNamedObject
    >,
    'value' | 'defaultValue'
  >,
  {
    resource: string;
  }
>) => {
  const Comp = function <
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined
  >(
    props: Except<
      LookupFieldProps<T, Multiple, DisableClearable, CreateFormValues>,
      'useLookup' | 'getCompareBy' | 'getOptionLabel'
    >
  ) {
    return (
      <LookupField<T, Multiple, DisableClearable, CreateFormValues>
        getCompareBy={(item) => item.id}
        getOptionLabel={(item: StandardNamedObject) => item.name.value}
        {...(config as any)}
        {...props}
      />
    );
  };
  Comp.displayName = `Lookup(${upperFirst(camelCase(resource))})`;
  return Comp;
};
