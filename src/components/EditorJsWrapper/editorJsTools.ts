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

const defineTools = <T extends EditorConfig['tools']>(tools: T) => tools;

export const EDITOR_JS_TOOLS = defineTools({
  // NOTE: EditorJS expects keys to be camelCase.
  // NOTE: Paragraph is a default tool.
  // There's no need to declare it, unless we need to change the options.
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
});

export type ToolKey = keyof typeof EDITOR_JS_TOOLS;

export const customTools = (toolsNames: ToolKey[]) =>
  pick(EDITOR_JS_TOOLS, toolsNames);
