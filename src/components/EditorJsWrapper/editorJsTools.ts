import CheckList from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Raw from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import { pick } from 'lodash';

// NOTE: The keys need to be camelCase as that's what EditorJS expects on the render side.
export const EDITOR_JS_TOOLS: EditorConfig['tools'] = {
  // NOTE: Paragraph is default tool. No need to declare it, unless you want to change paragraph option.
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  header: Header,
  quote: Quote,
  marker: Marker,
  checkList: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
};

export type ToolKey = keyof typeof EDITOR_JS_TOOLS;

export const customTools = (toolsNames: ToolKey[]) =>
  pick(EDITOR_JS_TOOLS, toolsNames);
