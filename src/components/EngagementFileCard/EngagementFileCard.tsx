import {
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadEngagementFiles } from '../../scenes/Engagement/Files';
import { InternshipEngagementDetailFragment as InternshipEngagement } from '../../scenes/Engagement/InternshipEngagement';
import { LanguageEngagementDetailFragment as LanguageEngagement } from '../../scenes/Engagement/LanguageEngagement';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  getPermittedFileActions,
  useFileActions,
} from '../files/FileActions';
import { useDateFormatter } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';
import { Redacted } from '../Redacted';
import { DropzoneOverlay } from '../Upload';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  root: {
    position: 'relative',
  },
  actionArea: {
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
    margin: spacing(1),
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export interface EngagementFileCardProps {
  engagement: LanguageEngagement | InternshipEngagement;
}

interface FileCardMetaProps {
  canRead: boolean;
  loading: boolean;
  text: string;
}

const FileCardMeta: FC<FileCardMetaProps> = ({ canRead, loading, text }) => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.fileMeta}
      color="initial"
      variant="caption"
      component="p"
    >
      {loading ? (
        <Skeleton />
      ) : !canRead ? (
        <Redacted info="You do not have permission to view files for this engagement" />
      ) : (
        text
      )}
    </Typography>
  );
};

const isLanguage = (
  engagement: LanguageEngagement | InternshipEngagement
): engagement is LanguageEngagement =>
  engagement.__typename === 'LanguageEngagement';

export const EngagementFileCard: FC<EngagementFileCardProps> = (props) => {
  const classes = useStyles();
  const { engagement } = props;
  const document = isLanguage(engagement)
    ? engagement.pnp
    : engagement.growthPlan;
  const { id } = engagement;

  const { canRead, canEdit } = document;
  const standardFileActions = getPermittedFileActions(canRead, canEdit);
  // PNPs/Growth Plans are always named "PNP" or "Growth Plan"
  const permittedFileActions = standardFileActions.filter(
    (action) => action !== FileAction.Rename
  );

  const file = document.value;
  const formatDate = useDateFormatter();
  const { openFilePreview } = useFileActions();
  const uploadFile = useUploadEngagementFiles(
    isLanguage(engagement) ? 'language' : 'internship'
  );

  const handleVersionUpload = (files: File[]) =>
    uploadFile({ files, engagementId: id, action: 'version' });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleVersionUpload,
    disabled: !canEdit,
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
    <Card {...getRootProps()} className={classes.root}>
      <input {...getInputProps()} name="engagement_file_version_uploader" />
      <DropzoneOverlay
        classes={{ text: classes.dropzoneText }}
        isDragActive={isDragActive}
        message="Drop new version to upload"
      />
      <CardActionArea
        className={classes.actionArea}
        disabled={!canRead}
        onClick={() => file && openFilePreview(file)}
      >
        <HugeIcon icon={ReportIcon} loading={!file} />
        <div className={classes.fileInfo}>
          <Typography className={classes.fileName} color="initial" variant="h4">
            {file ? name : <Skeleton width="80%" />}
          </Typography>
          <FileCardMeta
            canRead={canRead}
            text={`Updated by ${fullName}`}
            loading={!file}
          />
          <FileCardMeta
            canRead={canRead}
            text={formatDate(modifiedAt)}
            loading={!file}
          />
        </div>
      </CardActionArea>
      {canRead && (
        <div className={classes.actionsMenu}>
          {file && (
            <ActionsMenu
              actions={permittedFileActions}
              item={file}
              onVersionUpload={handleVersionUpload}
            />
          )}
        </div>
      )}
    </Card>
  );
};
