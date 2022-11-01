import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { square } from '~/common';
import { Avatar } from '../../../../components/Avatar';
import { UserListItemCardPortrait as UserCard } from '../../../../components/UserListItemCard';
import { MentorCardFragment } from './MentorCard.graphql';

export interface MentorCardProps {
  data?: MentorCardFragment;
  onEdit?: () => void;
  wrap?: (node: ReactNode) => ReactElement;
}

export const MentorCard = ({ data, onEdit, wrap }: MentorCardProps) => {
  if (data?.canRead === false) {
    return null;
  }
  const empty = data && !data.value;

  const mentor = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          // To match certification title.
          // This is hacky, we should try to find a way to do this without pixel
          // coupling.
          mt: 1,
          mb: 2,
        }}
      >
        Mentor
      </Typography>
      <UserCard
        user={data?.value || undefined}
        content={
          empty ? (
            <CardActionArea
              onClick={onEdit}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              aria-label="add mentor"
            >
              <CardContent>
                <Avatar
                  sx={{
                    ...square(86),
                    fontSize: 70,
                    color: 'background.paper',
                  }}
                >
                  <Add fontSize="inherit" />
                </Avatar>
              </CardContent>
            </CardActionArea>
          ) : undefined
        }
        action={
          <Button
            color="primary"
            disabled={!data || !data.canEdit}
            onClick={onEdit}
          >
            {empty ? 'Add' : 'Edit'} Mentor
          </Button>
        }
      />
    </Box>
  );

  return wrap ? wrap(mentor) : mentor;
};
