import type { OutputData as RichTextData } from '@editorjs/editorjs';
import type { Opaque } from 'type-fest';

export type RichTextJson = Opaque<RichTextData, 'EditorJS'>;
