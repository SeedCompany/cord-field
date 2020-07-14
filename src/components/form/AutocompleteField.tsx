import { QueryHookOptions } from '@apollo/client';
import {
  Chip,
  CircularProgress,
  makeStyles,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { Autocomplete, AutocompleteProps, Value } from '@material-ui/lab';
import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { Except } from 'type-fest';
import { FieldConfig, useField, useFieldName } from '.';
import { getHelperText, showError, useFocusOnEnabled } from './util';

// we don't need the query param since graphql codegen bakes this in
export type GenericUseQuery = (options?: QueryHookOptions) => QueryHookOptions;

export type AutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Except<
  FieldConfig<Value<T, Multiple, DisableClearable, FreeSolo>>,
  'multiple'
> & {
  name?: string;
  queryHook: GenericUseQuery;
  resource: string;
  TextFieldProps: Pick<TextFieldProps, 'helperText' | 'label' | 'required'>;
  // the shape from the query result to set the chip label -- only needed if multiple is true
  // ex. "name.value" or "id"
  chipLabelShape?: string;
} & Except<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    | 'value'
    | 'onChange'
    | 'renderInput'
    | 'renderTags'
    | 'loading'
    | 'filterSelectedOptions'
    | 'getOptionSelected'
    | 'options'
  >;

const useStyles = makeStyles(() => ({
  autocompleteInput: {
    padding: '10px !important',
  },
  noOptionsDiv: {
    display: 'none',
  },
  popupIndicator: {
    display: 'none',
  },
}));

export function AutocompleteField<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name: nameProp = 'autocomplete',
  multiple,
  defaultValue,
  disabled: disabledProp,
  queryHook,
  resource,
  ChipProps,
  chipLabelShape,
  TextFieldProps,
  ...props
}: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  const name = useFieldName(nameProp);
  const { input, meta, rest: autocompleteProps } = useField(name, props);
  const [value, setValue] = useState('');
  const classes = useStyles();
  const disabled = disabledProp ?? meta.submitting;
  const ref = useFocusOnEnabled(meta, disabled);
  const [searching, setSearching] = useState(false);
  const [options, setOptions] = useState<T[] | []>([]);
  const [selectedOptions, setSelectedOptions] = useState<T[] | []>([]);
  const { refetch, loading } = queryHook({ skip: true });
  useDebounce(
    async () => {
      if (value === '') return;
      const { data } = await refetch({
        input: {
          filter: {
            name: value,
          },
        },
      });
      setOptions(data[resource].items || []);
      setSearching(false);
    },
    500,
    [value]
  );
  return (
    <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
      disabled={disabled}
      // FF also has multiple and defaultValue
      multiple={multiple}
      defaultValue={defaultValue}
      options={[...options, ...selectedOptions]}
      // if we only have one value that can and has been selected, we don't want to hide it in the dropdown if we start deleting characters
      filterSelectedOptions={multiple}
      renderTags={(values: T[], getTagProps) => {
        return values.map((option: T, index: number) => {
          const label = chipLabelShape
            .split('.')
            .reduce((o: string, i: number) => o[i], option);
          return (
            <Chip
              variant="outlined"
              {...ChipProps}
              label={label}
              {...getTagProps({ index })}
            />
          );
        });
      }}
      onChange={(_, value: any[] | any, reason: string) => {
        if (reason === 'select-option') {
          if (!multiple) {
            setOptions([value]);
          } else {
            // we want to include previously selected options so we don't get an error in the console
            // but previously selected options are hidden in the list
            setSelectedOptions([...selectedOptions, value[value.length - 1]]);
            setOptions([]);
            setValue('');
          }
        } else if (reason === 'remove-option') {
          setValue('');
          setSelectedOptions([...value]);
        }
        input.onChange(
          multiple ? value.map((v: any) => v.id) : value?.id || ''
        );
      }}
      getOptionSelected={(option: any, value: any) => option.id === value.id}
      loading={searching}
      loadingText={<CircularProgress size={25} />}
      classes={{
        input: classes.autocompleteInput,
        // hide the "No Options" div and popup indicator when we haven't typed anything yet. Doesn't make sense to show this if we haven't given any input
        // unless we want to populate an autocomplete with options on initial render any input is given
        noOptions: !value ? classes.noOptionsDiv : undefined,
        popupIndicator: !value ? classes.popupIndicator : undefined,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...input}
          helperText={getHelperText(meta, TextFieldProps.helperText)}
          {...TextFieldProps}
          onInput={(e) => {
            const val = (e.target as any).value;
            if (val === '') {
              if (searching) {
                setSearching(false);
              }
              setOptions([]);
            } else {
              setSearching(true);
            }
            setValue(val);
          }}
          onBlur={() => {
            setOptions([]);
            setValue('');
          }}
          inputRef={ref}
          error={showError(meta)}
        />
      )}
      {...autocompleteProps}
    />
  );
}
