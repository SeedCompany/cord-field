import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  Chip,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { isEqual, uniqWith } from 'lodash';
import { useState } from 'react';
import { Except } from 'type-fest';
import {
  formatScriptureRange,
  parseScriptureRange,
  RawScriptureRange,
  ScriptureError,
  ScriptureRange,
  validateScriptureRange,
} from '../../common/biblejs';
import { FieldConfig, useField } from './useField';
import {
  areListsDeepEqual,
  compareNullable,
  getHelperText,
  showError,
} from './util';
import { requiredArray } from './validators';

type GenericScriptureRange = ScriptureRange | RawScriptureRange;

type Val = GenericScriptureRange | string;

export type VersesFieldProps = Except<FieldConfig<Val, true>, 'multiple'> & {
  book: string;
} & Pick<
    AutocompleteProps<GenericScriptureRange | string, true, false, true>,
    'fullWidth' | 'classes' | 'disabled' | 'ChipProps'
  > &
  Pick<
    TextFieldProps,
    'helperText' | 'label' | 'required' | 'autoFocus' | 'placeholder'
  >;

const validateInput = (input: string) => {
  const currentChar = input[input.length - 1];
  const inputWithoutCurrentChar = input.slice(0, -1);
  const [start = '', end] = inputWithoutCurrentChar.split('-');
  if (
    input.includes(':-') ||
    input.includes('-:') ||
    input.includes('--') ||
    input.includes('::') ||
    input.includes(':0') ||
    input.includes('-0') ||
    input.startsWith('0') ||
    input.startsWith(':') ||
    input.startsWith('-') ||
    // only one : per side of range
    (start.includes(':') && currentChar === ':' && !end) ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (end?.includes(':') && currentChar === ':') ||
    // only one - per range
    (inputWithoutCurrentChar.includes('-') && currentChar === '-')
  ) {
    return null;
  }
  return input;
};

export function VersesField({
  book,
  helperText: helperTextProp,
  ChipProps,
  autoFocus,
  required,
  label,
  placeholder = 'Example: 1:13-19, 12:1-47',
  ...props
}: VersesFieldProps) {
  const [errorCode, setErrorCode] = useState('');
  const validateReference = (ranges: readonly Val[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ranges || ranges.length === 0) return undefined;
    // only the last needs to be validated since the others have been already
    const rawScriptureRange = ranges[ranges.length - 1];
    try {
      validateScriptureRange(rawScriptureRange as RawScriptureRange);
      return undefined;
    } catch (ex) {
      const e = ex as ScriptureError;
      setErrorCode(e.code);
      return e.message;
    }
  };

  const [inputValue, setInputValue] = useState<string>('');
  const { input, meta, ref, rest } = useField<Val, true>({
    multiple: true,
    validate: [validateReference, required ? requiredArray : null],
    parse: (value: readonly Val[] | string): readonly Val[] => {
      // need to call onChange in two cases
      // 1: on type (string) so we can show errors in real time
      // 2: on change when a new value is added to tags (string[])
      if (typeof value === 'string') {
        if (value === '') {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          return scriptureRanges?.length > 0 ? scriptureRanges : [];
        }
        return [
          ...scriptureRanges,
          parseScriptureRange(book, value),
        ] as GenericScriptureRange[];
      } else {
        if (value.length === 0) {
          setScriptureRanges([]);
          return [];
        }
        // if two values are entered that are the same, but cosmetically different, dedup
        // ex. Exodus 1-2:25 is the same as Exodus 1-2
        const ranges = uniqWith(
          (value as Array<GenericScriptureRange | string>).map((range) =>
            typeof range === 'string' ? parseScriptureRange(book, range) : range
          ),
          isEqual
        ) as GenericScriptureRange[];
        // if we don't do this, before hitting enter (while typing a new value)
        // the old values are erased
        setScriptureRanges(ranges);
        return ranges;
      }
    },
    isEqual: compareNullable((a, b) => areListsDeepEqual(a, b)),
    ...props,
    autoFocus,
  });
  const [scriptureRanges, setScriptureRanges] = useState<readonly Val[]>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    input.value ?? []
  );

  const [_, end] = inputValue.split('-');

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [__, endVerse] = end?.split(':') ?? [undefined, undefined];

  const hideVerseOrderError =
    errorCode === 'verseOrder' &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (!end?.includes(':') || !endVerse || endVerse?.length < 1);

  const hideChapterOrderError =
    errorCode === 'chapterOrder' && !end?.includes(':');

  const hideVerseNumberError =
    errorCode === 'invalidVerse' &&
    end &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (!end.includes(':') || !endVerse);

  const error =
    showError(meta) ||
    (meta.error &&
      !hideVerseOrderError &&
      !hideChapterOrderError &&
      !hideVerseNumberError &&
      meta.error !== 'Required');

  const helperText = getHelperText(
    meta,
    error ? meta.error : helperTextProp || 'Press Enter to Add Selection',
    error
  );
  return (
    <Autocomplete<GenericScriptureRange | string, true, false, true>
      {...rest}
      classes={props.classes}
      multiple
      options={[]}
      freeSolo
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => {
          if (!option) return null;
          if (typeof option !== 'string') option = formatScriptureRange(option);
          return (
            <Chip
              variant="outlined"
              {...ChipProps}
              label={option}
              {...getTagProps({ index })}
              classes={{
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                ...(ChipProps?.classes ?? {}),
              }}
              sx={{
                color: '#FFFFFF',
                backgroundColor: '#2D9CDB',
                fontWeight: 600,
                lineHeight: '32px',
                margin: 2.5,
                fontSize: 16,
                '& .MuiChip-deleteIcon': {
                  color: '#FFFFFF',
                },
              }}
              key={index}
            />
          );
        });
      }}
      // @ts-expect-error typed as mutable even though its not needed
      value={scriptureRanges}
      inputValue={inputValue}
      onInputChange={(_, value) => {
        if (errorCode && !meta.error) setErrorCode('');
        const cleaned = value.replace(/[^\d:-]/g, '');
        const validated = cleaned ? validateInput(cleaned) : '';
        if (validated === null) return;
        input.onChange(validated);
        setInputValue(validated);
      }}
      onChange={(_, value) => {
        if (meta.error) {
          setErrorCode('createError');
          // it'd be nice to be able to preserve the input value if a user tries submitting when an error is present
          // setInputValue(value[value.length - 1] as string);
          if (!meta.touched) input.onBlur(); // disable submit button if there's an error on enter and if touched is false
        } else {
          // if it's valid, clear the input value and add the new scripture range to the list
          setInputValue('');
          input.onChange(value);
        }
      }}
      onFocus={input.onFocus}
      onBlur={input.onBlur}
      disabled={meta.disabled}
      renderInput={(params: AutocompleteRenderInputParams) => {
        return (
          <TextField
            {...params}
            name={input.name}
            label={label}
            variant="outlined"
            placeholder={scriptureRanges.length === 0 ? placeholder : ''}
            helperText={helperText}
            error={error}
            autoFocus={autoFocus}
            focused={meta.focused}
            inputRef={ref}
          />
        );
      }}
    />
  );
}
