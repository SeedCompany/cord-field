import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

export const HtmlPreview: FC<PreviewerProps> = (props) => {
  const { file, previewLoading, setPreviewLoading } = props;
  const [url, setUrl] = useState('');

  const createUrlForFile = useCallback(
    (file: File) => {
      setUrl(URL.createObjectURL(file));
      setPreviewLoading(false);
    },
    [setPreviewLoading, setUrl]
  );

  useEffect(() => {
    if (file) {
      createUrlForFile(file);
    }
  }, [file, createUrlForFile]);

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <iframe
      src={url}
      width={800}
      height={600}
      title="File Preview"
      referrerPolicy="no-referrer"
    />
  );
};
