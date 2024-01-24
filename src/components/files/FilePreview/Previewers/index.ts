import { lazy as loadable } from '@loadable/component';
import { HtmlPreview } from './HtmlPreview';
import { NativePreview } from './NativePreview';
import { NotSupportedPreview } from './NotSupportedPreview';
import { PlainTextPreview } from './PlainTextPreview';

export const Previewer = {
  Csv: loadable(() => import('./CsvPreview')),
  Email: loadable(() => import('./EmailPreview')),
  Excel: loadable(() => import('./ExcelPreview')),
  Html: HtmlPreview,
  Native: NativePreview,
  Pdf: loadable(() => import('./PdfPreview')),
  PlainText: PlainTextPreview,
  Rtf: loadable(() => import('./RtfPreview')),
  Word: loadable(() => import('./WordPreview')),
  NotSupported: NotSupportedPreview,
};
