import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  FinancialReportingTypeLabels,
  PartnerTypeLabels,
} from '~/api/schema.graphql';
import { canEditAny, labelsFrom, StyleProps } from '~/common';
import { Redacted } from '../../../components/Redacted';
import { PartnerDetailsFragment } from './PartnerDetail.graphql';

const cardContentSx = {
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

interface PartnerTypesCardProps extends StyleProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerTypesCard = ({
  partner,
  className,
  onEdit,
  sx,
}: PartnerTypesCardProps) => {
  const canEdit = canEditAny(
    partner,
    false,
    'types',
    'financialReportingTypes'
  );

  return (
    <Card className={className} sx={sx}>
      <CardActionArea onClick={onEdit} disabled={!canEdit} sx={cardContentSx}>
        <CardContent sx={cardContentSx}>
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
                  labelsFrom(PartnerTypeLabels)(partner.types.value) || 'None'
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
                    labelsFrom(FinancialReportingTypeLabels)(
                      partner.financialReportingTypes.value
                    )
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
      <CardActions
        sx={{ display: 'flex', justifyContent: 'space-between', pr: 2 }}
      >
        <Button color="primary" disabled={!canEdit} onClick={onEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
