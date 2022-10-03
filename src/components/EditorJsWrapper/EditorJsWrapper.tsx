import { EditorConfig } from '@editorjs/editorjs';
import { EditorCore } from '@react-editor-js/core';
import { createReactEditorJS } from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './editorJsTools';

export interface EditorJsWrapperProps extends EditorConfig {
  onInitialize?: (instance: EditorCore) => void;
  holder?: string;
  placeholder?: string;
  autofocus?: boolean;
}

export const EditorJsWrapper = ({
  onInitialize,
  holder,
  ...rest
}: EditorJsWrapperProps) => {
  const ReactEditorJS = createReactEditorJS();

  return (
    <ReactEditorJS
      onInitialize={onInitialize}
      holder={holder}
      tools={EDITOR_JS_TOOLS}
      {...rest}
    />
  );
};
