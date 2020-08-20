import { makeStyles } from '@material-ui/core';
import parse from 'html-react-parser';
import mammoth, { MammothOptions } from 'mammoth';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const mammothOptions: MammothOptions = {
  styleMap: ['u => em'],
};

const useStyles = makeStyles(() => ({
  root: {
    '& img': {
      maxWidth: '100%',
    },
  },
}));

export const WordPreview: FC<PreviewerProps> = (props) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const classes = useStyles();

  const extractHtmlFromDocument = useCallback(
    async (file: File) => {
      try {
        const docBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml(
          { arrayBuffer: docBuffer },
          mammothOptions
        );
        setHtml(parse(result.value));
        setPreviewLoading(false);
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
    <div className={classes.root}>{html}</div>
  );
};
