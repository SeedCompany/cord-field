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

  const measurement = product.progressStepMeasurement.value;
  const progressTarget = product.progressTarget.value;

  const firstStepNotDone = product.progressOfCurrentReportDue?.steps.find(
    (step) =>
      step.completed.value &&
      progressTarget &&
      step.completed.value < progressTarget
  );
  const allStepsDone =
    product.progressOfCurrentReportDue &&
    product.progressOfCurrentReportDue.steps.length > 0 &&
    product.progressOfCurrentReportDue.steps.every(
      (step) =>
        step.completed.value &&
        progressTarget &&
        step.completed.value === progressTarget
    );

  const stepToShow = firstStepNotDone
    ? {
        step: firstStepNotDone.step,
        completed: firstStepNotDone.completed.value!,
      }
    : allStepsDone
    ? {
        step: product.steps.value[product.steps.value.length - 1]!,
        completed: progressTarget!,
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
          {stepToShow && measurement && progressTarget && (
            <Grid item xs>
              <Typography variant="body2" align="right">
                {displayProductStep(stepToShow.step)} (Step {stepNumber} of{' '}
                {product.steps.value.length})
              </Typography>
              <LinearProgressBar
                value={stepToShow.completed}
                measurement={measurement}
                target={progressTarget}
              />
            </Grid>
          )}
        </Grid>
      </CardActionAreaLink>
    </Card>
  );
};
