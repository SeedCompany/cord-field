import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { Nullable } from '../../util';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useDateFormatter } from '../Formatters';
import { FundingAccountCardFragment } from './FundingAccountCard.generated';

const useStyles = makeStyles(({ spacing }) => {
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
  fundingAccount?: Nullable<FundingAccountCardFragment>;
}

export const FundingAccountCard: FC<FundingAccountCardProps> = ({
  className,
  fundingAccount,
}) => {
  const classes = useStyles();

  const formatDate = useDateFormatter();

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <Typography variant="h4" className={classes.name}>
          {!fundingAccount ? (
            <Skeleton width="50%" variant="text" />
          ) : (
            fundingAccount.name.value
          )}
        </Typography>
        <DisplaySimpleProperty
          label="Account Number"
          value={fundingAccount?.accountNumber.value}
          loading={!fundingAccount}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        {fundingAccount ? (
          <Typography variant="caption" color="textSecondary">
            Created {formatDate(fundingAccount.createdAt)}
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </CardActions>
    </Card>
  );
};
