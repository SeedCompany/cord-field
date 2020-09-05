import { Card, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadEngagementFiles } from '../../scenes/Engagement/Files';
import { LanguageEngagementDetailFragment } from '../../scenes/Engagement/LanguageEngagement';
import {
  FileActionsPopup as ActionsMenu,
  useFileActions,
} from '../files/FileActions';
import { useDateFormatter } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';
import { DropzoneOverlay } from '../Upload';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  root: {
    cursor: 'pointer',
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(3),
    position: 'relative',
  },
  dropzoneText: {
    fontSize: typography.h2.fontSize,
  },
  fileInfo: {
    flex: 1,
    paddingLeft: spacing(4),
  },
  fileName: {
    marginBottom: spacing(1),
  },
  fileMeta: {
    color: palette.text.secondary,
  },
  actionsMenu: {
    alignSelf: 'flex-start',
    marginTop: spacing(-1.5),
  },
}));

export interface EngagementFileCardProps {
  engagement: LanguageEngagementDetailFragment;
}

const FileCardMeta: FC<{ loading: boolean; text: string }> = ({
  loading,
  text,
}) => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.fileMeta}
      color="initial"
      variant="caption"
      component="p"
    >
      {!loading ? text : <Skeleton />}
    </Typography>
  );
};

export const EngagementFileCard: FC<EngagementFileCardProps> = (props) => {
  const classes = useStyles();
  const { engagement } = props;
  const { id } = engagement;
  const file = engagement.pnp.value;
  const formatDate = useDateFormatter();
  const { openFilePreview } = useFileActions();
  const uploadFile = useUploadEngagementFiles('language');

  const handleVersionUpload = (files: File[]) =>
    uploadFile({ files, engagementId: id, action: 'version' });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleVersionUpload,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const { modifiedAt, name, modifiedBy } = file ?? {
    modifiedAt: DateTime.local(),
    name: '',
    modifiedBy: {
      fullName: '',
    },
  };
  const { fullName } = modifiedBy;

  return (
    <Card
      {...getRootProps()}
      className={classes.root}
      onClick={() => file && openFilePreview(file)}
    >
      <input {...getInputProps()} name="pnp_version_uploader" />
      <DropzoneOverlay
        classes={{ text: classes.dropzoneText }}
        isDragActive={isDragActive}
        message="Drop new version to upload"
      />
      <HugeIcon icon={ReportIcon} loading={!file} />
      <div className={classes.fileInfo}>
        <Typography className={classes.fileName} color="initial" variant="h4">
          {file ? name : <Skeleton width="80%" />}
        </Typography>
        <FileCardMeta text={`Updated by ${fullName}`} loading={!file} />
        <FileCardMeta text={formatDate(modifiedAt)} loading={!file} />
      </div>
      <div className={classes.actionsMenu}>
        {file && (
          <ActionsMenu item={file} onVersionUpload={handleVersionUpload} />
        )}
      </div>
    </Card>
  );
};
