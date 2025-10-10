import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  ApproachIcons,
  displayMethodology,
  listOrPlaceholders,
  MethodologyToApproach,
} from '~/common';
import { MethodologiesCardFragment } from './MethodologiesCard.graphql';

export interface MethodologiesCardProps {
  data?: MethodologiesCardFragment;
  onClick?: () => void;
  className?: string;
}

export const MethodologiesCard = ({
  data,
  onClick,
  className,
}: MethodologiesCardProps) => {
  if (data?.canRead === false) {
    return null;
  }

  const methodologyListChips = listOrPlaceholders(data?.value, 2).map(
    (methodology, index) => (
      <Grid
        item
        key={methodology ?? index}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {methodology && (
          <Grid
            item
            wrap="nowrap"
            sx={{ display: 'flex', color: 'text.secondary', mr: 0.5 }}
          >
            {ApproachIcons[MethodologyToApproach[methodology]]}
          </Grid>
        )}
        <Grid item component={Typography} color="textSecondary">
          {methodology ? (
            displayMethodology(methodology)
          ) : (
            <Skeleton width={200} />
          )}
        </Grid>
      </Grid>
    )
  );

  const content = (
    <CardContent
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: 3,
        px: 4,
      }}
    >
      <Typography variant="h4" paragraph>
        Methodologies
      </Typography>
      <Grid container spacing={1}>
        {data?.value.length === 0 ? (
          <Grid item component={Typography} color="textSecondary">
            {data.canEdit ? 'None yet, click here to add some' : 'None yet'}
          </Grid>
        ) : (
          methodologyListChips
        )}
      </Grid>
    </CardContent>
  );

  return (
    <Card className={className} sx={{ width: '1', height: '1' }}>
      {data?.canEdit ? (
        <CardActionArea onClick={onClick} sx={{ height: '1' }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};
