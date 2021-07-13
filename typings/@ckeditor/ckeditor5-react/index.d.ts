declare module '@ckeditor/ckeditor5-react' {
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
  import * as React from 'react';

  interface ErrorDetails {
    phase: 'runtime' | 'initialization';
    willEditorRestart: boolean;
  }

  interface CKEditorProps {
    editor: typeof ClassicEditor;
    data?: Nullable<string>;
    config?: EditorConfig;
    onChange?: (
      event: React.ChangeEvent<HTMLElement>,
      editor: ClassicEditor
    ) => void;
    onReady?: (editor: ClassicEditor) => ClassicEditor;
    onFocus?: (
      event: React.FocusEvent<HTMLElement>,
      editor: ClassicEditor
    ) => void;
    onBlur?: (
      event: React.FocusEvent<HTMLElement>,
      editor: ClassicEditor
    ) => void;
    onError?: (error: Error, details: ErrorDetails) => void;
    disabled?: boolean;
  }

  export const CKEditor: React.ComponentClass<CKEditorProps>;
}
