import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorProps, CKEditor as ReactCKE } from '@ckeditor/ckeditor5-react';
import * as React from 'react';
import { Except } from 'type-fest';

const Editor = (props: Except<CKEditorProps, 'editor'>) => (
  <ReactCKE editor={ClassicEditor} {...props} />
);

// eslint-disable-next-line import/no-default-export
export default Editor;
