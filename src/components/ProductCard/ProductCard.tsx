import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  DescriptionOutlined,
  LibraryBooksOutlined,
  MenuBook,
  Movie,
  MusicNote,
  SvgIconComponent,
} from '@material-ui/icons';
import React from 'react';
import {
  displayProductStep,
  displayProductTypes,
  getProducibleName,
  getProductType,
} from '../../api';
import { ProductTypes } from '../../scenes/Products/ProductForm/constants';
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

const iconMap: Record<ProductTypes, SvgIconComponent> = {
  DirectScriptureProduct: MenuBook,
  Story: DescriptionOutlined,
  Film: Movie,
  Song: MusicNote,
  LiteracyMaterial: LibraryBooksOutlined,
  DerivativeScriptureProduct: DescriptionOutlined,
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const classes = useStyles();
  const type = getProductType(product);
  const producibleName = getProducibleName(product);

  const Icon = type ? iconMap[type] : undefined;

  const firstStepNotDone = product.progressOfCurrentReportDue?.steps.find(
    (step) => step.percentDone.value && step.percentDone.value < 100
  );
  const stepToShow = firstStepNotDone
    ? {
        step: firstStepNotDone.step,
        percentDone: firstStepNotDone.percentDone.value!,
      }
    : product.progressOfCurrentReportDue && product.steps.value[0]
    ? { step: product.steps.value[0], percentDone: 0 }
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
          {type && (
            <Grid item>
              <Typography variant="h4">{producibleName}</Typography>
              <Typography variant="body2">
                {displayProductTypes(type)}
              </Typography>
            </Grid>
          )}
          {stepToShow && (
            <Grid item xs>
              <Typography variant="body2" align="right">
                {displayProductStep(stepToShow.step)} (Step {stepNumber} of{' '}
                {product.steps.value.length})
              </Typography>
              <LinearProgressBar value={stepToShow.percentDone} />
            </Grid>
          )}
        </Grid>
      </CardActionAreaLink>
    </Card>
  );
};
