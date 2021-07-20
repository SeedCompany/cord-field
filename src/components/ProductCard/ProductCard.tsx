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
  MusicNote,
  PlayCircleFilled,
  SvgIconComponent,
} from '@material-ui/icons';
import React from 'react';
import {
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
  Film: PlayCircleFilled,
  Song: MusicNote,
  LiteracyMaterial: LibraryBooksOutlined,
  DerivativeScriptureProduct: DescriptionOutlined,
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const classes = useStyles();
  const type = getProductType(product);
  const producibleName = getProducibleName(product);

  const Icon = type ? iconMap[type] : undefined;

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
          <Grid item xs>
            <LinearProgressBar value={0} />
          </Grid>
        </Grid>
      </CardActionAreaLink>
    </Card>
  );
};
