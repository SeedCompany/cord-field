import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { PartnerDetailsFragment } from './PartnerDetail.generated';

const useStyles = makeStyles(({ spacing }) => ({
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: spacing(2),
  },
}));

interface AddressCardProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const AddressCard: FC<AddressCardProps> = ({
  partner,
  className,
  onEdit,
}) => {
  const classes = useStyles();

  // TODO: Implement full address saving and parsing (st, city, state, etc)

  return (
    <Card className={className}>
      <CardContent>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h4">
              {partner ? partner.address.value : <Skeleton width="75%" />}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button color="primary" disabled={!partner} onClick={onEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
