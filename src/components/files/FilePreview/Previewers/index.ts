import loadable from '@loadable/component';
import { HtmlPreview } from './HtmlPreview';
import { NativePreview } from './NativePreview';
import { NotSupportedPreview } from './NotSupportedPreview';
import { PlainTextPreview } from './PlainTextPreview';

export const Previewer = {
  Csv: loadable(() => import('./CsvPreview'), {
    resolveComponent: (m) => m.CsvPreview,
  }),
  Email: loadable(() => import('./EmailPreview'), {
    resolveComponent: (m) => m.EmailPreview,
  }),
  Excel: loadable(() => import('./ExcelPreview'), {
    resolveComponent: (m) => m.ExcelPreview,
  }),
  Html: HtmlPreview,
  Native: NativePreview,
  Pdf: loadable(() => import('./PdfPreview'), {
    resolveComponent: (m) => m.PdfPreview,
  }),
  PlainText: PlainTextPreview,
  Rtf: loadable(() => import('./RtfPreview'), {
    resolveComponent: (m) => m.RtfPreview,
  }),
  Word: loadable(() => import('./WordPreview'), {
    resolveComponent: (m) => m.WordPreview,
  }),
  NotSupported: NotSupportedPreview,
};
