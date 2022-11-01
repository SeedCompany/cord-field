import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDateTime } from '../Formatters';
import { FundingAccountCardFragment } from './FundingAccountCard.graphql';

interface FundingAccountCardProps {
  className?: string;
  fundingAccount: FundingAccountCardFragment;
}

export const FundingAccountCard = ({
  className,
  fundingAccount,
}: FundingAccountCardProps) => {
  return (
    <Card className={className} sx={{ width: '100%', maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {fundingAccount.name.value}
        </Typography>
        <DisplaySimpleProperty
          label="Account Number"
          value={fundingAccount.accountNumber.value}
        />
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Created <FormattedDateTime date={fundingAccount.createdAt} />
        </Typography>
      </CardActions>
    </Card>
  );
};
