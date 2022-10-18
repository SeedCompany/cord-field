import CheckList from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import { EditorConfig, ToolConstructable } from '@editorjs/editorjs';
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
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
};

export type CustomToolsInput = {
  [key in
    | 'paragraph'
    | 'embed'
    | 'table'
    | 'list'
    | 'warning'
    | 'code'
    | 'linkTool'
    | 'image'
    | 'raw'
    | 'header'
    | 'quote'
    | 'marker'
    | 'checklist'
    | 'delimiter'
    | 'inlineCode'
    | 'simpleImage']?: boolean;
};

export const customTools = (toolsNames: CustomToolsInput) => {
  const customTools: EditorConfig['tools'] = {};
  Object.keys(toolsNames).forEach((toolName) => {
    const keyName = toolName as keyof CustomToolsInput;
    if (toolsNames[keyName] && EDITOR_JS_TOOLS[keyName]) {
      customTools[keyName] = EDITOR_JS_TOOLS[toolName] as ToolConstructable;
    }
  });
  return customTools;
};
