import {
  AvatarGroup,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { To } from 'history';
import { compact } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import { listOrPlaceholders } from '~/common';
import { Avatar } from '../Avatar';
import { HugeIcon, HugeIconProps } from '../Icons';
import { CardActionAreaLink } from '../Routing';

const useStyles = makeStyles()(({ spacing }) => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarGroup: {
    marginRight: spacing(1),
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

export const MemberListSummary = ({
  members,
  max = 4,
  total,
  title,
  to,
  icon,
}: MemberListSummaryProps) => {
  const { classes } = useStyles();

  return (
    <CardActionAreaLink to={to} disabled={!members}>
      <CardContent>
        <Stack direction="row" spacing={4} mb={2}>
          <HugeIcon icon={icon} />
          <div>
            <Typography sx={{ whiteSpace: 'nowrap' }}>{title}</Typography>
            <Typography variant="h1">
              {!members ? <Skeleton width="1ch" variant="text" /> : total}
            </Typography>
          </div>
          <Typography
            color="primary"
            sx={{ flex: 1, textAlign: 'right', whiteSpace: 'nowrap' }}
          >
            See All
          </Typography>
        </Stack>
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
