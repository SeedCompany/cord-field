import {
  Button,
  CardActionArea,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ReactElement, ReactNode } from 'react';
import { square } from '~/common';
import { Avatar } from '../../../../components/Avatar';
import { UserListItemCardPortrait as UserCard } from '../../../../components/UserListItemCard';
import { MentorCardFragment } from './MentorCard.graphql';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  actionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    // To match certification title.
    // This is hacky, we should try to find a way to do this without pixel
    // coupling.
    marginTop: 7,
    marginBottom: 15,
  },
  avatar: {
    ...square(86),
    fontSize: 70,
    color: palette.background.paper,
  },
}));

export interface MentorCardProps {
  data?: MentorCardFragment;
  onEdit?: () => void;
  wrap?: (node: ReactNode) => ReactElement;
}

export const MentorCard = ({ data, onEdit, wrap }: MentorCardProps) => {
  const classes = useStyles();

  if (data?.canRead === false) {
    return null;
  }
  const empty = data && !data.value;

  const mentor = (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Mentor
      </Typography>
      <UserCard
        user={data?.value || undefined}
        content={
          empty ? (
            <CardActionArea
              onClick={onEdit}
              className={classes.actionArea}
              aria-label="add mentor"
            >
              <CardContent>
                <Avatar className={classes.avatar}>
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
    </div>
  );

  return wrap ? wrap(mentor) : mentor;
};
