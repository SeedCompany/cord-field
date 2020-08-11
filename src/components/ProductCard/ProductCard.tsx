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
import React from 'react';
import {
  displayMethodologyWithLabel,
  displayProductMedium,
  displayProductTypes,
  displayScripture,
} from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { ProgressButton } from '../ProgressButton';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { ProductCardFragment } from './ProductCard.generated';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& > a': {
      flexGrow: 1,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& > *': {
      margin: spacing(1, 0),
    },
  },
  actions: {
    justifyContent: 'space-around',
  },
  icon: {
    height: spacing(10),
    width: spacing(10),
  },
  deleteButton: {
    color: palette.error.main,
  },
}));

interface ProductCardProps {
  product: ProductCardFragment;
  handleDelete: () => void;
  isDeleteLoading?: boolean;
}

export const ProductCard = ({
  product,
  handleDelete,
  isDeleteLoading = false,
}: ProductCardProps) => {
  const classes = useStyles();
  const type =
    product.__typename === 'DerivativeScriptureProduct'
      ? product.produces.value?.__typename || 'DerivativeScriptureProduct'
      : product.__typename;

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
  };

  return (
    <Card classes={{ root: classes.root }}>
      <CardActionAreaLink to={`products/${product.id}`}>
        <CardContent className={classes.content}>
          {type && icons[type]}
          {type && (
            <Typography variant="h4">{displayProductTypes(type)}</Typography>
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
            value={product.scriptureReferences.value
              .map((scriptureReference) => displayScripture(scriptureReference))
              .join(', ')}
          />
        </CardContent>
      </CardActionAreaLink>
      <CardActions classes={{ root: classes.actions }}>
        {
          <ProgressButton
            progress={isDeleteLoading}
            onClick={handleDelete}
            className={classes.deleteButton}
          >
            Delete
          </ProgressButton>
        }
        <ButtonLink to={`products/${product.id}`} color="primary">
          Edit
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
