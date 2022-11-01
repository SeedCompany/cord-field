import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { canEditAny, StyleProps } from '~/common';
import { Redacted } from '../../../components/Redacted';
import { PartnerDetailsFragment } from './PartnerDetail.graphql';

const cardContent = {
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
};

interface AddressCardProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const AddressCard = ({
  partner,
  className,
  onEdit,
  sx,
}: AddressCardProps & StyleProps) => {
  // TODO: Implement full address saving and parsing (st, city, state, etc)

  const canEdit = canEditAny(partner, false, 'address');

  return (
    <Card className={className} sx={sx}>
      <CardActionArea onClick={onEdit} sx={cardContent} disabled={!canEdit}>
        <CardContent sx={cardContent}>
          <Typography
            variant="h4"
            sx={{
              width: '100%',
            }}
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
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pr: 2,
        }}
      >
        <Button color="primary" disabled={!canEdit} onClick={onEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
