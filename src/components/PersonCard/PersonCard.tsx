import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';
import { FC } from 'react';
import { Avatar } from '../Avatar';
import { ButtonLink } from '../Routing';

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
  roleName: {
    marginBottom: spacing(1),
  },
  organizationName: {
    marginBottom: spacing(0.25),
  },
  statusCircle: {
    height: '8px',
    width: '8px',
    marginRight: spacing(1),
    borderRadius: '50%',
    display: 'inline-block',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(2),
    border: `1px solid ${palette.grey[300]}`,
  },
  activeColor: {
    backgroundColor: '#619a55',
  },
  notActiveColor: {
    backgroundColor: palette.action.disabled,
  },
}));

export interface PersonCardProps {
  name: string;
  organization: string;
  role: string;
  active: boolean;
  personRoute: string;
  imageSource: string;
}

export const PersonCard: FC<PersonCardProps> = ({
  name,
  organization,
  role,
  active,
  personRoute,
  imageSource,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.personCard}>
      <CardContent className={classes.cardContent}>
        <Avatar
          variant="circle"
          alt={name}
          src={imageSource}
          className={classes.personImage}
        />
        <Typography
          color="textPrimary"
          variant="body2"
          className={classes.personName}
        >
          {name}
        </Typography>
        <Typography
          color="primary"
          variant="caption"
          className={classes.organizationName}
        >
          {organization}
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
          className={classes.roleName}
        >
          {role}
        </Typography>
        <Typography color="textSecondary" variant="caption">
          <span
            className={clsx(classes.statusCircle, {
              [classes.activeColor]: active,
              [classes.notActiveColor]: !active,
            })}
          />
          {active ? 'Active' : 'Inactive'}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <ButtonLink color="primary" to={personRoute}>
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
