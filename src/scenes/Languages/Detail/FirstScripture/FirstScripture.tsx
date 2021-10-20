import { makeStyles, Typography } from '@material-ui/core';
import {
  Check,
  IndeterminateCheckBox,
  NotInterested,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { IdFragment } from '../../../../api';
import { Redacted } from '../../../../components/Redacted';
import { Link } from '../../../../components/Routing';
import { getProjectUrl } from '../../../Projects/useProjectId';
import { FirstScriptureFragment } from './FirstScripture.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing(1),
  },
  text: {
    display: 'flex',
  },
}));

export const FirstScripture = ({ data }: { data?: FirstScriptureFragment }) => {
  const classes = useStyles();

  if (!data) {
    return (
      <div className={classes.root}>
        <Skeleton
          variant="circle"
          width={24}
          height={24}
          className={classes.icon}
        />
        <Skeleton width={300} />
      </div>
    );
  }

  if (!data.firstScripture.canRead) {
    return (
      <div className={classes.root}>
        <IndeterminateCheckBox className={classes.icon} />
        <Redacted
          info="You cannot view whether this language has first Scripture"
          width={300}
        />
      </div>
    );
  }

  if (data.hasExternalFirstScripture.value) {
    return (
      <div className={classes.root}>
        <Check color="primary" className={classes.icon} />
        <Typography>
          First Scripture was completed outside of Seed Company
        </Typography>
      </div>
    );
  }

  const engagement =
    data.firstScripture.value?.__typename === 'InternalFirstScripture'
      ? data.firstScripture.value.engagement
      : null;

  if (engagement) {
    const project = engagement.project;
    return (
      <div className={classes.root}>
        <Check color="primary" className={classes.icon} />
        <Typography className={classes.text}>
          First Scripture:&nbsp;&nbsp;
          <Link
            to={`${getProjectUrl(project as IdFragment)}/engagements/${
              engagement.id
            }`}
            underline={project.name.canRead ? undefined : 'none'}
          >
            {project.name.canRead ? (
              project.name.value
            ) : (
              <Redacted info="You cannot view the project's name" width={200} />
            )}
          </Link>
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <NotInterested className={classes.icon} />
      <Typography>No Scripture yet</Typography>
    </div>
  );
};
