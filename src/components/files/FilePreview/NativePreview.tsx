import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { NativePreviewerProps, NativePreviewType } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const useStyles = makeStyles(() => ({
  media: {
    maxWidth: 800,
  },
}));

export const NativePreview: FC<NativePreviewerProps> = (props) => {
  const classes = useStyles();
  const { file, type, previewLoading } = props;

  const unsupportedTypeMessage =
    'Your browser does not support this media type';

  const player = (type: NativePreviewType) => {
    return type === NativePreviewType.Image ? (
      <img src={file} className={classes.media} alt="" />
    ) : type === NativePreviewType.Audio ? (
      <audio controls autoPlay src={file}>
        {unsupportedTypeMessage}
      </audio>
    ) : (
      <video
        className={classes.media}
        controls
        autoPlay
        controlsList="nodownload"
      >
        <source src={file} />
        {unsupportedTypeMessage}
      </video>
    );
  };

  return previewLoading ? <PreviewLoading /> : file ? player(type) : null;
};
