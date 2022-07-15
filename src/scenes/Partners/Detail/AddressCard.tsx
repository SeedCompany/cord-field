import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { canEditAny } from '~/common';
import { Redacted } from '../../../components/Redacted';
import { PartnerDetailsFragment } from './PartnerDetail.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  cardContent: {
    display: 'flex',
    flex: 1,
    alignSelf: 'flex-start',
    // Allow point events so tooltips can be viewed, but don't seem clickable
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      '& .MuiCardActionArea-focusHighlight': {
        opacity: 0,
      },
    },
  },
  address: {
    width: '100%',
  },
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

export const AddressCard = ({
  partner,
  className,
  onEdit,
}: AddressCardProps) => {
  const { classes } = useStyles();

  // TODO: Implement full address saving and parsing (st, city, state, etc)

  const canEdit = canEditAny(partner, false, 'address');

  return (
    <Card className={className}>
      <CardActionArea
        onClick={onEdit}
        className={classes.cardContent}
        disabled={!canEdit}
      >
        <CardContent className={classes.cardContent}>
          <Typography
            variant="h4"
            className={classes.address}
            color={!partner?.address.value ? 'textSecondary' : undefined}
          >
            {!partner ? (
              <>
                <Skeleton width="75%" />
                <Skeleton width="50%" />
              </>
            ) : !partner.address.canRead ? (
              <Redacted
                info="You don't have permission to view this partner's address"
                width="75%"
              />
            ) : (
              partner.address.value || 'Add Address'
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button color="primary" disabled={!canEdit} onClick={onEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
