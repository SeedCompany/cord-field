import {
  Button,
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
import { displayMethodologyWithLabel, displayScripture } from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
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
}

export const ProductCard = ({ product, handleDelete }: ProductCardProps) => {
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
    <Card classes={{ root: classes.root }}>
      <CardActionAreaLink to={`products/${product.id}`}>
        <CardContent className={classes.content}>
          {icons[type]}
          <Typography variant="h4">{startCase(type)}</Typography>
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
              .map((medium) => startCase(medium))
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
        <Button onClick={handleDelete} className={classes.deleteButton}>
          Delete
        </Button>
        <ButtonLink to={`products/${product.id}`} color="primary">
          Edit
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
