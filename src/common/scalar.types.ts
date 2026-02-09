import type { OutputData as RichTextData } from '@editorjs/editorjs';
import type { JsonObject, Tagged } from 'type-fest';

export type RichTextJson = Tagged<RichTextData, 'EditorJS'>;

/** Tagged so it can be identified in type mapping */
export type JsonObjectScalar = Tagged<JsonObject, 'JSON'>;

export type MarkdownString = Tagged<string, 'Markdown'>;
export type InlineMarkdownString = Tagged<string, 'InlineMarkdown'>;
