import * as rtfToHTML from '@iarna/rtf-to-html';
import parse from 'html-react-parser';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

export const RtfPreview: FC<PreviewerProps> = (props) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);

  const extractHtmlFromDocument = useCallback(
    async (file: File) => {
      try {
        const rtfString = await file.text();
        rtfToHTML.fromString(
          rtfString,
          {
            template: (
              _: Record<string, any>,
              defaults: Record<string, any>,
              content: string
            ) => {
              return `
                <div style="
                  font-size: ${defaults.fontSize / 2}px;
                  text-indent: ${defaults.firstLineIndent / 20}px;
                  width: 80ch;
                ">
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

  return previewLoading ? <PreviewLoading /> : html;
};
