import type { OutputData as RichTextData } from '@editorjs/editorjs';
import type { Tagged } from 'type-fest';

export type RichTextJson = Tagged<RichTextData, 'EditorJS'>;

export type MarkdownString = Tagged<string, 'Markdown'>;
export type InlineMarkdownString = Tagged<string, 'InlineMarkdown'>;
