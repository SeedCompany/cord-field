import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';
import * as React from 'react';
import { FC } from 'react';
import { useDateFormatter } from '../Formatters';
import { CeremonyCardFragment } from './CeremonyCard.generated';

const useStyles = makeStyles(({ palette, spacing }) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  certificationCard: {
    flex: 1,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actualDate: {
    height: 98,
    width: 226,
    backgroundColor: palette.grey[300],
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing(1),
    marginBottom: spacing(2),
  },

  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(2),
    borderTop: `1px solid ${palette.grey[300]}`,
  },
}));

type CeremonyCardProps = CeremonyCardFragment & {
  canEdit?: boolean;
  canRead?: boolean;
  editCeremony: () => void;
};

export const CeremonyCard: FC<CeremonyCardProps> = ({
  estimatedDate,
  actualDate,
  canEdit,
  editCeremony,
  type,
  planned,
  //TODO: implement canRead functionality
  // canRead
}) => {
  const classes = useStyles();
  const formatDate = useDateFormatter();

  return (
    <div>
      <div className={classes.header}>
        <Switch
          checked={Boolean(planned.value)}
          name="planned"
          color="primary"
        />
        <Typography variant="h4">{`${type} Plan`}</Typography>
      </div>
      <Card className={classes.certificationCard}>
        <CardContent className={classes.cardContent}>
          <Typography color="textPrimary" variant="body2">
            {`${type} Date`}
          </Typography>
          <div className={classes.actualDate}>
            <Typography color="primary" variant="h2">
              {formatDate(actualDate.value)}
            </Typography>
          </div>

          <Typography color="textPrimary" variant="body1">
            Estimated Date
          </Typography>
          <Typography color="textPrimary" variant="body1">
            {formatDate(estimatedDate.value)}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button color="primary" onClick={editCeremony} disabled={!canEdit}>
            Edit dates
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
