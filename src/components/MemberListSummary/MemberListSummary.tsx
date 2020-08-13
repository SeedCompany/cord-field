import { CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { AvatarGroup, Skeleton } from '@material-ui/lab';
import { To } from 'history';
import { compact } from 'lodash';
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
  id: string;
}

export interface MemberListSummaryProps extends Pick<HugeIconProps, 'icon'> {
  members?: MemberSummaryItem[];
  max?: number;
  total?: number;
  title: string;
  to: To;
}

export const MemberListSummary: FC<MemberListSummaryProps> = ({
  members,
  max = 4,
  total,
  title,
  to,
  icon,
}) => {
  const classes = useStyles();

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
              {!members ? <Skeleton width="1ch" variant="text" /> : total}
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
                key={member?.id || i}
                loading={!member}
                alt={member?.label}
                src={member?.picture}
              >
                {member?.avatarLetters?.slice(0, 2)}
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
              memberNames(members, max)
            )}
          </Typography>
        </div>
      </CardContent>
    </CardActionAreaLink>
  );
};

function memberNames(members: MemberSummaryItem[] | undefined, max: number) {
  const membersToDisplay = compact(
    members?.map((member) => member.label)
  ).slice(0, max);
  const remainingCount = members!.length - membersToDisplay.length;
  const names = membersToDisplay.join(', ');
  const extra =
    remainingCount > 0
      ? `${remainingCount} other${remainingCount > 1 ? 's' : ''}`
      : '';
  return compact([names, extra]).join(' & ');
}
