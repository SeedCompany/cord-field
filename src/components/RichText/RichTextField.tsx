import type { EditorConfig } from '@editorjs/editorjs';
import loadable from '@loadable/component';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { EditorCore } from '@react-editor-js/core';
import { pick } from 'lodash';
import { ReactNode, useId, useRef, useState } from 'react';
import { extendSx, StyleProps } from '../../common';
import { FieldConfig, useField } from '../form';
import { getHelperText, showError } from '../form/util';
import { EditorJsTheme } from './EditorJsTheme';
import type { ToolKey } from './editorJsTools';

export type RichTextFieldProps = FieldConfig<unknown> & {
  tools?: ToolKey[];
  label?: ReactNode;
  helperText?: ReactNode;
  placeholder?: string;
} & StyleProps;

export function RichTextField({
  tools: toolNames,
  label,
  helperText,
  sx,
  className,
  placeholder,
  ...props
}: RichTextFieldProps) {
  const instanceRef = useRef<EditorCore>();
  const [isReady, setReady] = useState(false);

  const { input, meta, ref, rest } = useField(props);

  const id = useId();

  const loading = (
    <Loading label={label} placeholder={placeholder} helperText={helperText} />
  );
  if (typeof window === 'undefined') {
    return loading;
  }

  // Make sure these load in parallel, not sequentially as they would below.
  Lib.preload();
  Tools.preload();

  return (
    <>
      {!isReady && loading}

      <Lib>
        {({ createReactEditorJS: pickEditorComponent }) => (
          <Tools>
            {({ EDITOR_JS_TOOLS }) => {
              const EditorJS = pickEditorComponent(); // Returns a constant value

              const tools = toolNames
                ? (pick(EDITOR_JS_TOOLS, toolNames) as EditorConfig['tools'])
                : EDITOR_JS_TOOLS;
              return (
                <EditorJS
                  tools={tools}
                  autofocus={props.autoFocus}
                  holder={id}
                  minHeight={14} // matches minRows=2
                  placeholder={placeholder}
                  onInitialize={(instance) => {
                    instanceRef.current = instance;
                    setReady(false);
                  }}
                  onReady={() => {
                    setReady(true);
                  }}
                  readOnly={meta.disabled}
                >
                  <FormControl
                    sx={[
                      EditorJsTheme,
                      ...extendSx(sx),
                      !isReady && { display: 'none' },
                    ]}
                    className={className}
                    variant="outlined"
                    disabled={meta.disabled}
                    error={showError(meta)}
                  >
                    <InputLabel
                      // TODO may do nothing as "div" is not _labelable_.
                      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for
                      htmlFor={id}
                    >
                      {label}
                    </InputLabel>
                    <OutlinedInput
                      id={id}
                      inputComponent={'div' as any}
                      inputProps={{
                        // prevent OutlineInput from adding type="text" to the div
                        type: undefined,
                      }}
                      inputRef={ref}
                      role="textbox"
                      aria-multiline
                      label={label}
                    />
                    <FormHelperText id={`${id}-helper-text`}>
                      {getHelperText(meta, helperText)}
                    </FormHelperText>
                  </FormControl>
                </EditorJS>
              );
            }}
          </Tools>
        )}
      </Lib>
    </>
  );
}

const Loading = (
  props: Pick<TextFieldProps, 'placeholder' | 'label' | 'helperText'>
) => (
  <TextField
    variant="outlined"
    {...props}
    helperText={props.helperText ?? ' '}
    multiline
    disabled
    minRows={2}
  />
);

const Lib = loadable.lib(() => import('react-editor-js'), {
  ssr: false,
});
const Tools = loadable.lib(() => import('./editorJsTools'), {
  ssr: false,
});
