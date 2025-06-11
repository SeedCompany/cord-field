import {
  Check,
  IndeterminateCheckBox,
  NotInterested,
} from '@mui/icons-material';
import { Skeleton, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Redacted } from '../../../../components/Redacted';
import { Link } from '../../../../components/Routing';
import { FirstScriptureFragment } from './FirstScripture.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
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
  const { classes } = useStyles();

  if (!data) {
    return (
      <div className={classes.root}>
        <Skeleton
          variant="circular"
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

  const scripture = data.firstScripture.value;

  if (!scripture?.hasFirst) {
    return (
      <div className={classes.root}>
        <NotInterested className={classes.icon} />
        <Typography>No Scripture yet</Typography>
      </div>
    );
  }

  if (scripture.__typename === 'ExternalFirstScripture') {
    return (
      <div className={classes.root}>
        <Check color="primary" className={classes.icon} />
        <Typography>
          First Scripture was completed outside of Seed Company
        </Typography>
      </div>
    );
  }

  if (scripture.__typename !== 'InternalFirstScripture') {
    return null; // Shouldn't ever happen, unless other types are added
  }

  const project = scripture.engagement.project;

  return (
    <div className={classes.root}>
      <Check color="primary" className={classes.icon} />
      <Typography className={classes.text}>
        First Scripture was recorded in the&nbsp;
        <Link
          to={`/engagements/${scripture.engagement.id}`}
          underline={project.name.canRead ? undefined : 'none'}
        >
          {project.name.canRead ? (
            project.name.value
          ) : (
            <Redacted info="You cannot view the project's name" width={200} />
          )}
        </Link>
        &nbsp;Project
      </Typography>
    </div>
  );
};
