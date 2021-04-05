import { makeStyles, Typography } from '@material-ui/core';
import {
  Check,
  IndeterminateCheckBox,
  NotInterested,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { assert } from 'ts-essentials';
import { Redacted } from '../../../../components/Redacted';
import { Link } from '../../../../components/Routing';
import { isTypename } from '../../../../util';
import {
  LanguageProjectEngagement_LanguageEngagement_Fragment as Engagement,
  FirstScriptureFragment,
} from './FirstScripture.generated';

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

  const engagements = data?.projects.items
    .flatMap((project) => project.engagements.items)
    .filter(isTypename<Engagement>('LanguageEngagement'));

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
  assert(engagements);

  if (
    !data.projects.canRead ||
    !data.hasExternalFirstScripture.canRead ||
    engagements.some((e) => !e.firstScripture.canRead || !e.language.canRead)
  ) {
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
        <Typography>First Scripture was completed outside of CORD</Typography>
      </div>
    );
  }

  // If the API is working properly, there should be a maximum of 1
  const engagement = engagements.find(
    (engagement) =>
      engagement.firstScripture.value &&
      engagement.language.value!.id === data.id
  );
  if (engagement) {
    const project = data.projects.items.find((p) =>
      p.engagements.items.some((e) => e.id === engagement.id)
    )!;

    return (
      <div className={classes.root}>
        <Check color="primary" className={classes.icon} />
        <Typography className={classes.text}>
          First Scripture:&nbsp;&nbsp;
          <Link
            to={`/projects/${project.id}/engagements/${engagement.id}`}
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
