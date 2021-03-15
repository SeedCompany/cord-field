import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { canEditAny } from '../../../api';
import { Redacted } from '../../../components/Redacted';
import { PartnerDetailsFragment } from './PartnerDetail.generated';

const useStyles = makeStyles(({ spacing }) => ({
  cardContent: {
    flexGrow: 1,
    // Allow point events so tooltips can be viewed, but don't seem clickable
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      '& .MuiCardActionArea-focusHighlight': {
        opacity: 0,
      },
    },
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: spacing(2),
  },
}));

interface PartnerTypesCardProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerTypesCard: FC<PartnerTypesCardProps> = ({
  partner,
  className,
  onEdit,
}) => {
  const classes = useStyles();

  const canEdit = canEditAny(
    partner,
    false,
    'types',
    'financialReportingTypes'
  );

  return (
    <Card className={className}>
      <CardActionArea
        onClick={onEdit}
        className={classes.cardContent}
        disabled={!canEdit}
      >
        <CardContent className={classes.cardContent}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography
                variant="h4"
                color={
                  partner?.types.value.length === 0
                    ? 'textSecondary'
                    : undefined
                }
              >
                {!partner ? (
                  <Skeleton width="75%" />
                ) : partner.types.canRead ? (
                  partner.types.value.join(', ') || 'None'
                ) : (
                  <Redacted
                    info="You don't have permission to view the partner's types"
                    width="100%"
                  />
                )}
              </Typography>
            </Grid>

            {partner &&
            (partner.financialReportingTypes.value.length ||
              !partner.financialReportingTypes.canRead) ? (
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Financial Reporting Types
                </Typography>
                <Typography variant="h4">
                  {partner.financialReportingTypes.canRead ? (
                    partner.financialReportingTypes.value.join(', ')
                  ) : (
                    <Redacted
                      info="You don't have permission to view the partner's financial reporting types"
                      width="75%"
                    />
                  )}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
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
