import { CSSProperties } from 'react';
import { RTFDocument, RTFGroup, RTFParagraph } from 'rtf-parser';

// eslint-disable-next-line import/no-default-export
export default function asStream(
  opts?: RtfToHtmlOptions,
  cb: RtfToHtmlCallback
): WritableStream;

export function fromStream(
  stream: ReadableStream,
  opts?: RtfToHtmlOptions,
  cb: RtfToHtmlCallback
): void;

export function fromString(
  string: string,
  opts?: RtfToHtmlOptions,
  cb: RtfToHtmlCallback
): void;

function outputTemplate(
  doc: RTFDocument,
  defaults: RtfToHtmlDefaults,
  content: string
): string;

export type RtfToHtmlCallback = (
  err: Error | undefined,
  html: string | undefined
) => void;

export interface RtfToHtmlFont {
  name: string;
  family: 'roman' | 'swiss' | 'script' | 'decor' | 'modern' | 'tech' | 'bidi';
}

export interface RtfToHtmlDefaults {
  font: RtfToHtmlFont;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  foreground: { red: number; blue: number; green: number };
  background: { red: number; blue: number; green: number };
  firstLineIndent: number;
  indent: number;
  align: CSSProperties['text-align'];
  valign: CSSProperties['vertical-align'];
  paraBreaks: string;
  paraTag: string;
  template: outputTemplate;
}

export type RtfToHtmlOptions = Partial<RtfToHtmlDefaults>;
