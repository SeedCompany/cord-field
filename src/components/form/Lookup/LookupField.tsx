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
import React, { ComponentType, useEffect, useState } from 'react';
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
  FreeSolo extends boolean | undefined,
  CreateFormValues
> = Except<
  FieldConfig<Value<T, Multiple, DisableClearable, FreeSolo>>,
  'multiple' | 'allowNull' | 'parse' | 'format'
> &
  Pick<TextFieldProps, 'helperText' | 'label' | 'required' | 'autoFocus'> & {
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
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    | 'value'
    | 'onChange'
    | 'defaultValue'
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
  FreeSolo extends boolean | undefined,
  CreateFormValues = never
>({
  name: nameProp,
  multiple,
  defaultValue,
  disabled: disabledProp,
  useLookup,
  ChipProps,
  autoFocus,
  helperText,
  label,
  required,
  CreateDialogForm,
  getInitialValues,
  getCompareBy,
  getOptionLabel: getOptionLabelProp,
  ...props
}: LookupFieldProps<
  T,
  Multiple,
  DisableClearable,
  FreeSolo,
  CreateFormValues
>) {
  type Val = Value<T, Multiple, DisableClearable, FreeSolo>;

  const name = useFieldName(nameProp);
  const { input: field, meta, rest: autocompleteProps } = useField<Val>(name, {
    ...props,
    required,
    allowNull: !multiple,
    defaultValue: (multiple ? emptyArray : null) as Val,
    isEqual: compareNullable((a, b) =>
      multiple
        ? areListsEqual(a.map(getCompareBy), b.map(getCompareBy))
        : getCompareBy(a) === getCompareBy(b)
    ),
  });
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled(meta, disabled);

  const getOptionLabel = (val: T | string) =>
    typeof val === 'string' ? val : getOptionLabelProp(val) ?? '';

  const selectedText =
    multiple || !field.value ? '' : getOptionLabel(field.value as T);

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

  // Only open popup if searching for item
  const open = Boolean(input) && input !== selectedText;

  const options = [
    ...(data?.search.items ?? []),
    // Add currently selected items to options so prevent MUI warning
    // They will be hidden via filterSelectedOptions
    ...((multiple ? field.value : []) as T[]),
  ];
  const autocomplete = (
    <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
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
      renderOption={(option) => {
        if (typeof option === 'string') {
          return `Add "${option}"`;
        }
        return getOptionLabel(option);
      }}
      filterOptions={(options, params) => {
        // If freeSolo we can add new options i.e. 'Add "X"'.
        if (!props.freeSolo) return options;

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
      value={field.value}
      inputValue={input}
      onBlur={field.onBlur}
      onFocus={field.onFocus}
      onInputChange={(_, val) => {
        setInput(val);
      }}
      onChange={(_, value) => {
        const lastItem = multiple ? last(value as T[]) : value;
        if (typeof lastItem === 'string' && props.freeSolo) {
          createDialogItem(lastItem);
          // Don't store the new value as a string in FF.
          // Wait till it's successfully created and returned from the API.
          return;
        }
        field.onChange(value);
      }}
      loading={loading}
      loadingText={<CircularProgress size={16} />}
      open={open}
      forcePopupIcon={!open ? false : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={getHelperText(meta, helperText)}
          required={required}
          inputRef={ref}
          error={showError(meta)}
          autoFocus={autoFocus}
          // variant="outlined" TODO maybe for multiple?
        />
      )}
      getOptionSelected={(a, b) => getCompareBy(a) === getCompareBy(b)}
      {...autocompleteProps}
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

LookupField.createFor = <T extends { id: string }, CreateFormValues = never>({
  resource,
  ...config
}: Merge<
  Except<
    SetOptional<
      LookupFieldProps<T, any, any, any, CreateFormValues>,
      'name' | 'getCompareBy'
    >,
    'value' | 'defaultValue'
  >,
  {
    resource: string;
  }
>) => {
  const Comp = function <
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
  >(
    props: Except<
      LookupFieldProps<
        T,
        Multiple,
        DisableClearable,
        FreeSolo,
        CreateFormValues
      >,
      'useLookup' | 'getCompareBy' | 'getOptionLabel'
    >
  ) {
    return (
      <LookupField<T, Multiple, DisableClearable, FreeSolo, CreateFormValues>
        getCompareBy={(item) => item.id}
        {...(config as any)}
        {...props}
      />
    );
  };
  Comp.displayName = `Lookup(${upperFirst(camelCase(resource))})`;
  return Comp;
};
