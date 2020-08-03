import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  DescriptionOutlined,
  LibraryBooksOutlined,
  MenuBook,
  MusicNote,
  PlayCircleFilled,
} from '@material-ui/icons';
import { startCase } from 'lodash';
import React from 'react';
import { displayMethodologyWithLabel } from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { ProductCardFragment } from './ProductCard.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: 240,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: spacing(1, 0),
    },
  },
  actions: {
    justifyContent: 'center',
  },
  icon: {
    height: spacing(10),
    width: spacing(10),
  },
}));

interface ProductCardProps {
  product: ProductCardFragment;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const classes = useStyles();
  const type =
    product.__typename === 'DerivativeScriptureProduct'
      ? product.produces.value?.__typename || 'DerivativeScriptureProduct'
      : 'Scripture';

  const icons = {
    DirectScriptureProduct: (
      <MenuBook color="secondary" classes={{ root: classes.icon }} />
    ),
    Story: (
      <DescriptionOutlined color="secondary" classes={{ root: classes.icon }} />
    ),
    Film: (
      <PlayCircleFilled color="secondary" classes={{ root: classes.icon }} />
    ),
    Song: <MusicNote color="secondary" classes={{ root: classes.icon }} />,
    LiteracyMaterial: (
      <LibraryBooksOutlined
        color="secondary"
        classes={{ root: classes.icon }}
      />
    ),
    DerivativeScriptureProduct: (
      <DescriptionOutlined color="secondary" classes={{ root: classes.icon }} />
    ),
    Scripture: <MenuBook color="secondary" classes={{ root: classes.icon }} />,
  };
  return (
    <Card className={classes.root}>
      <CardContent>
        <CardActionAreaLink
          to={`products/${product.id}`}
          className={classes.content}
        >
          {icons[type]}
          <Typography variant="h4">{startCase(type)}</Typography>
          <DisplaySimpleProperty
            label="Method"
            value={
              product.methodology.value &&
              displayMethodologyWithLabel(product.methodology.value)
            }
          />
          <DisplaySimpleProperty
            label="Mediums"
            value={product.mediums.value
              .map((medium) => startCase(medium))
              .join(', ')}
          />
        </CardActionAreaLink>
      </CardContent>
      <CardActions classes={{ root: classes.actions }}>
        <ButtonLink to={`products/${product.id}`} color="primary">
          Edit Product
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
