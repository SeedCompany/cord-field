import * as rtfToHTML from '@iarna/rtf-to-html';
import parse from 'html-react-parser';
import { useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

export const RtfPreview = (props: PreviewerProps) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<ReturnType<typeof parse> | null>(null);

  const extractHtmlFromDocument = useCallback(
    async (file: File) => {
      try {
        const rtfString = await file.text();
        rtfToHTML.fromString(
          rtfString,
          {
            template: (
              _: rtfToHTML.RtfToHtmlDoc,
              __: rtfToHTML.RtfToHtmlDefaults,
              content: string
            ) => {
              // Adding this wrapper <div> prevents the library from adding
              // <html> and <body> tags
              return `
                <div>
                  ${content.replace(/\n/, '\n    ')}
                </div>
              `;
            },
          },
          (error, html) => {
            if (error || !html) {
              console.log(error);
              setPreviewError('Could not read document file');
            } else {
              setHtml(parse(html));
              setPreviewLoading(false);
            }
          }
        );
      } catch {
        setPreviewError('Could not read document file');
      }
    },
    [setPreviewLoading, setPreviewError]
  );

  useEffect(() => {
    if (file) {
      void extractHtmlFromDocument(file);
    }
  }, [file, extractHtmlFromDocument]);

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <div style={{ width: '80ch' }}>{html}</div>
  );
};

// eslint-disable-next-line import/no-default-export
export default RtfPreview;
