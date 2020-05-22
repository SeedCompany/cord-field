import { CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { AvatarGroup, Skeleton } from '@material-ui/lab';
import { To } from 'history';
import { FC } from 'react';
import * as React from 'react';
import { listOrPlaceholders } from '../../util';
import { Avatar } from '../Avatar';
import { HugeIcon, HugeIconProps } from '../Icons';
import { CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ spacing }) => ({
  grid: {
    marginBottom: spacing(2),
  },
  seeAll: {
    marginLeft: 'auto',
  },
  bottomContent: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarGroup: {
    marginRight: spacing(1),
  },
  skeletonText: {
    marginLeft: spacing(1),
  },
  memberNames: {
    flexGrow: 1,
  },
}));

export interface MemberSummaryItem {
  // url to picture
  picture?: string;
  // will display these letters if picture url isn't given
  avatarLetters?: string;
  label: string;
}

export interface MemberListSummaryProps extends Pick<HugeIconProps, 'icon'> {
  members?: MemberSummaryItem[];
  max?: number;
  title: string;
  to: To;
}

export const MemberListSummary: FC<MemberListSummaryProps> = ({
  members,
  max = 4,
  title,
  to,
  icon,
}) => {
  const classes = useStyles();
  const membersToDisplay = members?.slice(0, max);
  const amountOfNonDisplayedMembers = Math.max((members?.length ?? 0) - max, 0);
  const firstCoupleNamesString = membersToDisplay
    ?.map((member) => member.label)
    .join(', ');

  return (
    <CardActionAreaLink to={to} disabled={!members}>
      <CardContent>
        <Grid container spacing={4} className={classes.grid}>
          <Grid item>
            <HugeIcon icon={icon} />
          </Grid>
          <Grid item>
            <Typography>{title}</Typography>
            <Typography variant="h1">
              {!members ? (
                <Skeleton width="1ch" variant="text" />
              ) : (
                members.length
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.seeAll}>
            <Typography color="primary">See All</Typography>
          </Grid>
        </Grid>
        <div className={classes.bottomContent}>
          <AvatarGroup max={max} className={classes.avatarGroup}>
            {listOrPlaceholders(members, max).map((member, i) => (
              <Avatar
                key={member?.label ?? i}
                loading={!member}
                alt={member?.label}
                src={member?.picture}
              >
                {member?.avatarLetters}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography
            className={classes.memberNames}
            color="primary"
            variant="body2"
          >
            {!members ? (
              <>
                <Skeleton variant="text" width="75%" />
                <Skeleton variant="text" width="50%" />
              </>
            ) : (
              <>
                {firstCoupleNamesString}
                {amountOfNonDisplayedMembers > 0 &&
                  ` & ${amountOfNonDisplayedMembers} ${
                    amountOfNonDisplayedMembers > 1 ? 'others' : 'other'
                  }`}
              </>
            )}
          </Typography>
        </div>
      </CardContent>
    </CardActionAreaLink>
  );
};
