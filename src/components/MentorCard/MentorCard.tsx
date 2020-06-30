import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import * as React from 'react';
import { FC } from 'react';
import { Avatar } from '../Avatar';
import { MentorCardFragment } from './MentorCard.generated';

const useStyles = makeStyles(({ palette, spacing }) => ({
  personCard: {
    maxWidth: '247px',
    paddingTop: spacing(1),
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  personName: {
    paddingBottom: spacing(0.5),
  },
  personImage: {
    width: '86px',
    height: '86px',
    paddingBottom: spacing(2),
  },
  organizationName: {
    marginBottom: spacing(0.25),
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(2),
    border: `1px solid ${palette.grey[300]}`,
  },
}));

type MentorCardProps = MentorCardFragment & {
  imageSource?: string;
  editMentor?: () => void;
};
export const MentorCard: FC<MentorCardProps> = ({
  fullName,
  organizations,
  editMentor,
  imageSource,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.personCard}>
      <CardContent className={classes.cardContent}>
        <Avatar
          variant="circle"
          src={imageSource}
          className={classes.personImage}
        />
        <Typography
          color="textPrimary"
          variant="body2"
          className={classes.personName}
        >
          {fullName}
        </Typography>
        <Typography
          color="primary"
          variant="caption"
          className={classes.organizationName}
        >
          {organizations.items[0].name.value}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button color="primary" onClick={editMentor}>
          Edit Mentor
        </Button>
      </CardActions>
    </Card>
  );
};
