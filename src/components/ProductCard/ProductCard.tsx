import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  AddCircle,
  DescriptionOutlined,
  LibraryBooksOutlined,
  MenuBook,
  MusicNote,
  PlayCircleFilled,
  SvgIconComponent,
} from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import {
  displayMethodologyWithLabel,
  displayProductMedium,
  displayProductTypes,
} from '../../api';
import { ProductTypes } from '../../scenes/Products/ProductForm/constants';
import {
  removeScriptureTypename,
  scriptureRangeToText,
} from '../../util/biblejs';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { ProductCardFragment } from './ProductCard.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  actionArea: {
    flex: 1,
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: spacing(1, 0),
    },
  },
  contentAdd: {
    padding: spacing(7, 0),
    justifyContent: 'center',
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
  const type =
    product.__typename === 'DerivativeScriptureProduct'
      ? product.produces.value?.__typename || 'DerivativeScriptureProduct'
      : product.__typename;

  const producibleName =
    product.__typename === 'DerivativeScriptureProduct' &&
    (product.produces.value?.__typename === 'Film'
      ? product.produces.value.name.value
      : product.produces.value?.__typename === 'LiteracyMaterial'
      ? product.produces.value.name.value
      : product.produces.value?.__typename === 'Song'
      ? product.produces.value.name.value
      : product.produces.value?.__typename === 'Story'
      ? product.produces.value.name.value
      : '');

  const Icon = type ? iconMap[type] : undefined;

  return (
    <Card className={classes.root}>
      <CardActionAreaLink
        to={`products/${product.id}`}
        className={classes.actionArea}
      >
        <CardContent className={classes.content}>
          {Icon && <Icon color="secondary" className={classes.icon} />}
          {type && (
            <Typography variant="h4" align="center">{`${displayProductTypes(
              type
            )}${producibleName ? ` - ${producibleName}` : ''}`}</Typography>
          )}
          <DisplaySimpleProperty
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
            label="Scripture"
            align="center"
            value={scriptureRangeToText(
              removeScriptureTypename(product.scriptureReferences.value)
            )}
          />
        </CardContent>
      </CardActionAreaLink>
      <CardActions>
        <ButtonLink to={`products/${product.id}`} color="primary">
          Edit
        </ButtonLink>
      </CardActions>
    </Card>
  );
};

export const AddProductCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionAreaLink to="./products/create" className={classes.actionArea}>
        <CardContent className={clsx(classes.content, classes.contentAdd)}>
          <AddCircle color="disabled" className={classes.icon} />
          <Typography variant="h4">Add Product</Typography>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
