import { Chip, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { FC, useState, useRef } from 'react';
import { Except } from 'type-fest';
import { useField, useFieldName } from '.';
import {
  parseScriptureRange,
  validateScriptureRange,
} from '../../util/biblejs/reference';
import {
  FormattedTextField,
  FormattedTextFieldProps,
} from './FormattedTextField';
// import { useFocusOnEnabled } from './util';
// import { showError } from './util';
import { useForm } from 'react-final-form';

export type VerseFieldProps = Except<
  FormattedTextFieldProps,
  'type' | 'name' | 'inputMode' | 'replace'
> & {
  name?: string;
  book: string;
};

export const VersesField: FC<VerseFieldProps> = ({
  name: nameProp = 'verses',
  book = 'Exodus',
  ...props
}) => {
  const validateReference = (r: string) => {
    const scriptureRange = parseScriptureRange(book, r);
    // should we say something else here?
    if (!scriptureRange) return undefined;
    try {
      validateScriptureRange(scriptureRange);
      return undefined;
    } catch (e) {
      return e.toString().replace('Error: ', '');
    }
  };

  const ref = useRef();

  const form = useForm();

  const name = useFieldName(nameProp);
  const { input, meta } = useField(name, {
    ...props,
    validate: validateReference,
  });
  return (
    <Autocomplete
      multiple
      options={[]}
      // we can enter anything - this also prevents the "no options" text from appearing when we focus the field
      freeSolo
      renderTags={(values: string[], getTagProps) => {
        return values.map((option: string, index: number) => {
          if (!option) return;
          return (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          );
        });
      }}
      onChange={(event: any, value: any, reason: string) => {
        if (reason === 'create-option' && meta.error) {
          value[value.length - 1] = null;
        }
      }}
      renderInput={(params) => {
        return (
          <FormattedTextField
            {...props}
            {...params}
            {...input}
            name={name}
            label="Verses"
            placeholder="Enter Verses"
            // validate={validateReference}
            ref={ref}
            // so much hack! I'm losing my mind
            onInput={(e) => {
              const cleaned = e.target.value.replace(/[^\d:-]/g, '');
              input.onChange(cleaned);
              if (form.getState().errors.verses) {
                form.blur('verses');
              }
              if (/[^\d:-]/.test(e.target.value)) {
                ref.current.value = cleaned;
              }
            }}
          />
        );
      }}
    />
  );
};
