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
import { sumBy } from 'lodash';
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

const useStyles = makeStyles(({ spacing }) => ({
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
    marginRight: spacing(2),
  },
  producibleName: {
    fontSize: '18px',
    lineHeight: '22px',
    whiteSpace: 'nowrap',
    textAlign: 'left',
  },
  typeName: {
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'left',
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

  const productProgress =
    sumBy(product.productSteps.items, (item) => item.progress || 0) /
    product.productSteps.items.length;

  return (
    <Card className={classes.root}>
      <CardActionAreaLink
        to={`products/${product.id}`}
        className={classes.actionArea}
      >
        <CardContent className={classes.content}>
          <Grid item container xs={6} alignItems="center">
            {Icon && <HugeIcon className={classes.icon} icon={Icon} />}
            {type && (
              <div>
                <Typography
                  className={classes.producibleName}
                  variant="h3"
                  align="center"
                >
                  {producibleName}
                </Typography>
                <Typography
                  className={classes.typeName}
                  variant="h4"
                  align="center"
                >
                  {displayProductTypes(type)}
                </Typography>
              </div>
            )}
          </Grid>
          <Grid item container xs={6}>
            <LinearProgressBar value={productProgress || 0} />
            {/* <DisplaySimpleProperty
              label="Methodology"
              align="center"
              value={
                product.methodology.value &&
                displayMethodologyWithLabel(product.methodology.value)
              }
            />
            <DisplaySimpleProperty
              label="Mediums"
              align="center"
              value={product.mediums.value
                .map((medium) => displayProductMedium(medium))
                .join(', ')}
            />
            <DisplaySimpleProperty
              label="Scripture Reference"
              align="center"
              value={scriptureRangeToText(
                removeScriptureTypename(product.scriptureReferences.value)
              )}
            /> */}
          </Grid>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
