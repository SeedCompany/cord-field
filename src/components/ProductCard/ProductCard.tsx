import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  DescriptionOutlined,
  HelpOutlined,
  LibraryBooksOutlined,
  MenuBook,
  Movie,
  MusicNote,
  SvgIconComponent,
} from '@material-ui/icons';
import React from 'react';
import { displayProductStep } from '../../api';
import { HugeIcon } from '../Icons';
import { LinearProgressBar } from '../LinearProgressBar';
import { CardActionAreaLink } from '../Routing';
import { ProductCardFragment } from './ProductCard.generated';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
  },
  actionArea: {
    flex: 1,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
  },
}));

interface ProductCardProps {
  product: ProductCardFragment;
}

const iconMap: Record<string, SvgIconComponent> = {
  Scripture: MenuBook,
  Story: DescriptionOutlined,
  Film: Movie,
  Song: MusicNote,
  'Literacy Material': LibraryBooksOutlined,
  Other: HelpOutlined,
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const classes = useStyles();

  const Icon = product.category ? iconMap[product.category] : undefined;

  const firstStepNotDone = product.progressOfCurrentReportDue?.steps.find(
    (step) => step.completed.value && step.completed.value < 100
  );
  const stepToShow = firstStepNotDone
    ? {
        step: firstStepNotDone.step,
        completed: firstStepNotDone.completed.value!,
      }
    : product.progressOfCurrentReportDue && product.steps.value[0]
    ? { step: product.steps.value[0], completed: 0 }
    : undefined;
  const stepIndex = stepToShow
    ? product.steps.value.indexOf(stepToShow.step)
    : -1;
  const stepNumber = stepIndex >= 0 ? stepIndex + 1 : null;

  return (
    <Card className={classes.root}>
      <CardActionAreaLink
        to={`products/${product.id}`}
        className={classes.actionArea}
      >
        <Grid component={CardContent} container spacing={2} alignItems="center">
          {Icon && (
            <Grid item>
              <HugeIcon className={classes.icon} icon={Icon} />
            </Grid>
          )}
          <Grid item>
            <Typography variant="h4">{product.label}</Typography>
            <Typography variant="body2">{product.category}</Typography>
          </Grid>
          {stepToShow && (
            <Grid item xs>
              <Typography variant="body2" align="right">
                {displayProductStep(stepToShow.step)} (Step {stepNumber} of{' '}
                {product.steps.value.length})
              </Typography>
              <LinearProgressBar value={stepToShow.completed} />
            </Grid>
          )}
        </Grid>
      </CardActionAreaLink>
    </Card>
  );
};
