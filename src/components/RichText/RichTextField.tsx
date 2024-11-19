import type {
  EditorConfig,
  default as EditorJS,
  LogLevels,
  OutputData as RichTextData,
} from '@editorjs/editorjs';
import loadable from '@loadable/component';
import {
  Box,
  ClickAwayListener,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { many } from '@seedcompany/common';
import { useDebounceFn, useEventListener } from 'ahooks';
import { identity, isEqual, pick, sumBy } from 'lodash';
import {
  forwardRef,
  MouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import filterXSS from 'xss';
import { extendSx, Nullable, StyleProps } from '~/common';
import { FieldConfig, useField } from '../form';
import { getHelperText, showError } from '../form/util';
import { FormattedNumber } from '../Formatters';
import { EditorJsTheme } from './EditorJsTheme';
import type { ToolKey } from './editorJsTools';
import { handleMsPasteFormatting } from './ms-word-helpers';
import { RichTextView } from './RichTextView';

declare module '@editorjs/editorjs/types/data-formats/output-data' {
  interface OutputData {
    characterCount?: number;
  }
}

export type RichTextFieldProps = Pick<
  FieldConfig<RichTextData>,
  'name' | 'disabled' | 'required' | 'autoFocus'
> & {
  tools?: ToolKey[];
  label?: ReactNode;
  helperText?: ReactNode;
  placeholder?: string;
  showCharacterCount?: boolean;
} & StyleProps;

export function RichTextField({
  tools: toolNames,
  label,
  helperText,
  sx,
  className,
  placeholder,
  showCharacterCount,
  ...props
}: RichTextFieldProps) {
  const instanceRef = useRef<EditorJS>();
  const [isReady, setReady] = useState(false);

  const onFocus = useCallback(() => {
    instanceRef.current?.focus();
  }, [instanceRef]);
  const handleFocusFromClick = (e: MouseEvent) =>
    // Focus the editor or keep the editor focused
    meta.active ? e.preventDefault() : onFocus();

  // Keep a cache of values produced by this editor instance, so we can know
  // whether new values from final form are actually new or just from our own round trip.
  const [internallyProduced] = useState(() => new WeakSet<RichTextData>());

  const { input, meta, ref } = useField({
    ...props,
    onFocus,
    multiple: false, // default, but it helps types
    allowNull: true,
    format: identity, // prevents empty strings in place of null
    validate: (value: Nullable<RichTextData>) => {
      if (value === savingSigil) {
        // Prevent submitting if saving is in progress
        return 'Waiting for editor';
      }
      if (props.required && isDataEmpty(value)) {
        return 'Required';
      }
      return undefined;
    },
    isEqual: isRichTextEqual,
  });

  const id = useId();

  // Keep the timestamp of the latest change event, so we can confirm after
  // the async save finishes that only the latest change is used.
  // This is probably excessive; I'm just trying to prevent race conditions.
  const latestChangeTimestamp = useRef(0);
  const onChange = useDebounceFn(
    ((api, event) => {
      // Last event timestamp of change batch
      const changeAt = many(event).at(-1)!.timeStamp;

      latestChangeTimestamp.current = changeAt;
      input.onChange(savingSigil); // Prevent submitting while saving
      void api.saver.save().then((data) => {
        if (latestChangeTimestamp.current > changeAt) {
          // A newer change is already in progress
          return;
        }

        if (showCharacterCount) {
          data.characterCount = countCharacters(data);
        }

        if (process.env.NODE_ENV !== 'production') {
          data = Object.freeze(data);
        }
        internallyProduced.add(data);
        input.onChange(data);
      });
    }) satisfies EditorConfig['onChange'],
    {
      wait: 200,
      maxWait: 200,
    }
  );

  const val = input.value as RichTextData | undefined;

  useEventListener(
    'paste',
    (event: ClipboardEvent) => {
      const formattedUl: RichTextData | undefined =
        handleMsPasteFormatting(event);
      if (formattedUl) {
        event.preventDefault();
        input.onChange(formattedUl);
      }
    },
    { target: ref }
  );

  useEffect(() => {
    if (!instanceRef.current || !isReady) {
      return;
    }
    if (val && (val === savingSigil || internallyProduced.has(val))) {
      return;
    }

    // Ensure in-progress saving is ignored, as we are resetting state.
    latestChangeTimestamp.current = performance.now();

    if (!isDataEmpty(val)) {
      void instanceRef.current.render(val!);
    } else {
      if (isEditorEmpty(ref)) {
        // Optimization to prevent changes when empty -> empty.
        return;
      }
      instanceRef.current.clear();
    }
  }, [
    val,
    isReady,
    instanceRef,
    latestChangeTimestamp,
    internallyProduced,
    ref,
  ]);

  const loading = (
    <Loading value={val} {...{ label, placeholder, helperText }} />
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
              console.log('tools', tools);
              return (
                <EditorJS
                  tools={tools}
                  autofocus={props.autoFocus}
                  holder={id}
                  logLevel={'WARN' as LogLevels}
                  minHeight={14} // matches minRows=2
                  placeholder={placeholder}
                  onInitialize={(instance) => {
                    instanceRef.current = instance.dangerouslyLowLevelInstance;
                    setReady(false);
                  }}
                  onReady={() => {
                    setReady(true);
                  }}
                  readOnly={meta.disabled}
                  onChange={onChange.run}
                >
                  <ClickAwayListener onClickAway={() => input.onBlur()}>
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
                      // If FF thinks it is active, show it as such
                      focused={meta.active}
                    >
                      <InputLabel
                        // TODO may do nothing as "div" is not _labelable_.
                        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for
                        htmlFor={id}
                        onMouseDown={handleFocusFromClick}
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
                        onFocus={input.onFocus}
                        onMouseDownCapture={(e) => {
                          // Certain places around the editor visually look to be
                          // a part of the field (OutlinedInput) but don't count as
                          // a focusable target.
                          // In these cases, we want to apply focus, or if already
                          // focused, maintained that focus.
                          if (
                            e.target === ref.current ||
                            (e.target instanceof HTMLDivElement &&
                              e.target.className.includes('codex-editor'))
                          ) {
                            handleFocusFromClick(e);
                          }
                        }}
                        onKeyDownCapture={(e) => {
                          // Prevent blur flash when backspace on empty
                          if (e.key === 'Backspace' && isEditorEmpty(ref)) {
                            e.stopPropagation();
                          }
                        }}
                        sx={{ bgcolor: 'background.paper' }}
                      />

                      <FormHelperText>
                        {getHelperText(
                          meta,
                          <Grid
                            container
                            spacing={1}
                            justifyContent="space-between"
                            component="span"
                          >
                            {helperText !== false && (
                              <Grid
                                item
                                component="span"
                                // Maintain line height even when empty
                                sx={{ '&:before': { content: `"\\200b"` } }}
                              >
                                {helperText}
                              </Grid>
                            )}
                            {showCharacterCount && !isDataEmpty(val) && val && (
                              <Grid
                                item
                                component="span"
                                sx={{ whiteSpace: 'nowrap' }}
                              >
                                <FormattedNumber value={val.characterCount} />{' '}
                                characters
                              </Grid>
                            )}
                          </Grid>
                        )}
                      </FormHelperText>
                    </FormControl>
                  </ClickAwayListener>
                </EditorJS>
              );
            }}
          </Tools>
        )}
      </Lib>
    </>
  );
}

const Loading = ({
  value,
  ...props
}: Pick<TextFieldProps, 'placeholder' | 'label' | 'helperText'> & {
  value?: RichTextData;
}) => {
  // eslint-disable-next-line react/display-name
  const Input = forwardRef(({ className }: StyleProps, ref) => (
    <Box ref={ref as any} className={className} sx={{ minHeight: 45 }}>
      <RichTextView data={value} />
    </Box>
  ));
  return (
    <TextField
      variant="outlined"
      {...props}
      helperText={props.helperText ?? ' '}
      InputProps={{ inputComponent: Input as any }}
      disabled
      sx={{ opacity: 0.5 }}
    />
  );
};

// There's no API to determine if currently empty.
// And the empty placeholder is rendered as a block.
// So this css class seems like the safest way to determine empty.
const isEditorEmpty = (ref: RefObject<HTMLElement>) =>
  ref.current
    ?.querySelector('.codex-editor')
    ?.classList.contains('codex-editor--empty') &&
  ref.current.querySelectorAll('.codex-editor .ce-block').length === 1 &&
  // If not the default block, then assume there are more actions the remaining block could take.
  !!ref.current.querySelector('.codex-editor .ce-block .ce-paragraph');

const isDataEmpty = (value: Nullable<RichTextData>) =>
  !value || value.blocks.length === 0;

const isRichTextEqual = (
  a: Nullable<RichTextData>,
  b: Nullable<RichTextData>
) => {
  const aBlocks = a?.blocks ?? [];
  const bBlocks = b?.blocks ?? [];
  return isEqual(aBlocks, bBlocks);
};

const savingSigil: RichTextData = { time: 0, blocks: [] };

const Lib = loadable.lib(() => import('react-editor-js'), {
  ssr: false,
});
const Tools = loadable.lib(() => import('./editorJsTools'), {
  ssr: false,
});

const countCharacters = (data: RichTextData) =>
  sumBy(data.blocks, (block) => {
    switch (block.type) {
      case 'paragraph':
      case 'header': {
        const text = filterXSS(block.data.text, {
          whiteList: {}, // filter out all tags
          stripIgnoreTag: true, // filter out all HTML not in the `whiteList`
          stripIgnoreTagBody: ['script'], // the script tag is a special case, we need to filter out its content
        });
        return text.length;
      }
      case 'list':
        return sumBy(block.data.items, (item: string) => item.length);
      default:
        return 0;
    }
  });
