import { EditorConfig } from '@editorjs/editorjs';
import { EditorCore } from '@react-editor-js/core';
import { createReactEditorJS } from 'react-editor-js';
import { customTools, EDITOR_JS_TOOLS, ToolKey } from './editorJsTools';

export interface EditorJsWrapperProps extends EditorConfig {
  onInitialize?: (instance: EditorCore) => void;
  holder?: string;
  placeholder?: string;
  autofocus?: boolean;
  blocks?: JSON;
  customTools?: ToolKey[];
}

export const EditorJsWrapper = ({
  onInitialize,
  holder,
  customTools: tools,
  ...rest
}: EditorJsWrapperProps) => {
  const ReactEditorJS = createReactEditorJS();
  const editorJsTools = tools ? customTools(tools) : EDITOR_JS_TOOLS;

  return (
    <ReactEditorJS
      onInitialize={onInitialize}
      holder={holder}
      tools={editorJsTools}
      data={rest.blocks}
      {...rest}
    />
  );
};
