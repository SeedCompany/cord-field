import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  makeStyles,
  NoSsr,
} from '@material-ui/core';
import { ReactNode } from 'react';
import * as React from 'react';
import { FieldConfig, useField } from './useField';
import { getHelperText, showError } from './util';

export type RichTextFieldProps = FieldConfig<string> & {
  label?: ReactNode;
  name: string;
  helperText?: ReactNode;
} & Pick<
    FormControlProps,
    'color' | 'fullWidth' | 'margin' | 'size' | 'variant'
  >;

const useStyles = makeStyles(() => ({
  // Use @global basically never
  '@global': {
    '.ck-editor__editable_inline': {
      minHeight: 200,
    },
  },
}));

export function RichTextField({
  label,
  helperText,
  defaultValue,
  fullWidth,
  margin,
  variant,
  ...props
}: RichTextFieldProps) {
  const { input, meta, rest } = useField({
    defaultValue,
    ...props,
  });

  // must be called to apply style overrides for ck-editor
  useStyles();

  return (
    <FormControl
      required={props.required}
      error={showError(meta)}
      disabled={meta.disabled}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <NoSsr>
        <CKEditor
          editor={ClassicEditor}
          data={input.value}
          onChange={(_event, editor) => {
            input.onChange(editor.getData());
          }}
          onFocus={(event, _editor) => {
            input.onFocus(event);
          }}
          onBlur={(event, _editor) => {
            input.onBlur(event);
          }}
          {...rest}
        />
      </NoSsr>
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
}
