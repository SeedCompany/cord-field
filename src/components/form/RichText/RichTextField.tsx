import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { ReactNode } from 'react';
import * as React from 'react';
import { FieldConfig, useField } from '../useField';
import { getHelperText, showError } from '../util';
import { CKEditor } from './CKEditor.lazy';

export type RichTextFieldProps = FieldConfig<string> & {
  label?: ReactNode;
  name: string;
  helperText?: ReactNode;
} & Pick<
    FormControlProps,
    'color' | 'fullWidth' | 'margin' | 'size' | 'variant'
  >;

const useStyles = makeStyles(
  (theme: Theme) => ({
    // Use @global basically never
    '@global': {
      '.ck-editor__editable_inline': {
        minHeight: 200,
      },
      // Matches OutlinedInput
      '.ck.ck-editor__main > .ck-editor__editable:not(.ck-focused):hover': {
        borderColor: theme.palette.text.primary,
      },
      '.ck.ck-tooltip .ck.ck-tooltip__text': {
        fontSize: (theme.overrides!.MuiTooltip!.tooltip as any).fontSize,
      },
      body: {
        '--ck-border-radius': `${theme.shape.borderRadius}px`,

        '--ck-font-size-base': `${theme.typography.body1.fontSize}px`,
        '--ck-line-height-base': theme.typography.body1.lineHeight,
        '--ck-font-face': theme.typography.fontFamily,

        '--ck-color-base-background': theme.palette.background.paper,
        '--ck-color-button-save': theme.palette.success.main,
        '--ck-color-button-cancel': theme.palette.error.main,
        '--ck-color-tooltip-background': (
          theme.overrides!.MuiTooltip!.tooltip as any
        ).backgroundColor,
        '--ck-color-tooltip-text': theme.palette.common.white,
        '--ck-color-widget-blurred-border': '0',
        '--ck-color-base-border':
          // Matches OutlinedInput
          theme.palette.type === 'light'
            ? 'rgba(0, 0, 0, 0.23)'
            : 'rgba(255, 255, 255, 0.23)',
        '--ck-color-focus-border': `${theme.palette.primary.main}`,
        '--ck-focus-ring': `2px solid var(--ck-color-focus-border)`,
        '--ck-inner-shadow': '0',
        '--ck-focus-outer-shadow': '0',
      },
    },
  }),
  {
    classNamePrefix: 'CKEditor',
  }
);

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
      <CKEditor
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
      <FormHelperText>{getHelperText(meta, helperText)}</FormHelperText>
    </FormControl>
  );
}
