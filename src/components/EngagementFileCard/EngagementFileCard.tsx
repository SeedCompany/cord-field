import {
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { LanguageEngagementDetailFragment } from '../../scenes/Engagement/LanguageEngagement';
import { useDateFormatter } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    flex: 1,
    height: '100%',
  },
  actionArea: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: spacing(3, 4),
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
}));

export interface EngagementFileCardProps {
  file: LanguageEngagementDetailFragment['pnp']['value'];
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
  const { file } = props;
  const formatDate = useDateFormatter();
  const { modifiedAt, name, modifiedBy } = file ?? {
    modifiedAt: undefined,
    name: '',
    modifiedBy: {
      displayFirstName: { value: '' },
      displayLastName: { value: '' },
    },
  };
  const {
    displayFirstName: { value: firstName },
    displayLastName: { value: lastName },
  } = modifiedBy;

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={classes.actionArea}
        onClick={() => console.log('Preview File')}
      >
        <HugeIcon icon={ReportIcon} loading={!file} />
        <div className={classes.fileInfo}>
          <Typography className={classes.fileName} color="initial" variant="h4">
            {file ? name : <Skeleton width="80%" />}
          </Typography>
          <FileCardMeta
            text={`Updated by ${firstName} ${lastName}`}
            loading={!file}
          />
          <FileCardMeta text={formatDate(modifiedAt)} loading={!file} />
        </div>
      </CardActionArea>
    </Card>
  );
};
