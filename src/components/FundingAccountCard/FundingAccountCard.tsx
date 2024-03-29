import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDateTime } from '../Formatters';
import { FundingAccountCardFragment } from './FundingAccountCard.graphql';

const useStyles = makeStyles()(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: 400,
    },
    name: {
      marginBottom: spacing(2),
    },
    cardActions: {
      justifyContent: 'flex-end',
    },
  };
});

interface FundingAccountCardProps {
  className?: string;
  fundingAccount: FundingAccountCardFragment;
}

export const FundingAccountCard = ({
  className,
  fundingAccount,
}: FundingAccountCardProps) => {
  const { classes, cx } = useStyles();

  return (
    <Card className={cx(classes.root, className)}>
      <CardContent>
        <Typography variant="h4" className={classes.name}>
          {fundingAccount.name.value}
        </Typography>
        <DisplaySimpleProperty
          label="Account Number"
          value={fundingAccount.accountNumber.value}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Typography variant="caption" color="textSecondary">
          Created <FormattedDateTime date={fundingAccount.createdAt} />
        </Typography>
      </CardActions>
    </Card>
  );
};
