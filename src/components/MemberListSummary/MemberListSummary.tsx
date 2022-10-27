import {
  AvatarGroup,
  Box,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { To } from 'history';
import { compact } from 'lodash';
import { listOrPlaceholders } from '~/common';
import { Avatar } from '../Avatar';
import { HugeIcon, HugeIconProps } from '../Icons';
import { CardActionAreaLink } from '../Routing';

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
  return (
    <CardActionAreaLink to={to} disabled={!members}>
      <CardContent>
        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item>
            <HugeIcon icon={icon} />
          </Grid>
          <Grid item>
            <Typography>{title}</Typography>
            <Typography variant="h1">
              {!members ? <Skeleton width="1ch" variant="text" /> : total}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              marginLeft: 'auto',
            }}
          >
            <Typography color="primary">See All</Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AvatarGroup max={max} sx={{ mr: 1 }}>
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
            sx={{
              flexGrow: 1,
            }}
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
        </Box>
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
