import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  makeStyles,
  Skeleton,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import {
  ApproachIcons,
  displayMethodology,
  listOrPlaceholders,
  MethodologyToApproach,
} from '~/common';
import { MethodologiesCardFragment } from './MethodologiesCard.graphql';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  actionArea: {
    height: '100%',
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(3, 4),
  },
  methodology: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    color: palette.text.secondary,
    marginRight: spacing(0.5),
  },
}));

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
  const classes = useStyles();

  if (data?.canRead === false) {
    return null;
  }

  const methodologyListChips = listOrPlaceholders(data?.value, 2).map(
    (methodology, index) => (
      <Grid item className={classes.methodology} key={methodology ?? index}>
        {methodology && (
          <Grid item wrap="nowrap" className={classes.icon}>
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
    <CardContent className={classes.cardContent}>
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
    <Card className={clsx(classes.root, className)}>
      {data?.canEdit ? (
        <CardActionArea onClick={onClick} className={classes.actionArea}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};
