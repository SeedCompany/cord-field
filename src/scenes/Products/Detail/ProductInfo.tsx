import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import {
  displayMethodologyWithLabel,
  displayProductMedium,
  displayProductPurpose,
} from '../../../api';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { ProductDetailFragment as Product } from './ProductDetail.generated';

export const ProductInfo = ({ product }: { product?: Product }) => (
  <>
    <DisplayProperty
      label="Mediums"
      value={product?.mediums.value.map(displayProductMedium).join(', ')}
      loading={!product}
      wrap={(node) => <Grid item>{node}</Grid>}
    />

    <DisplayProperty
      label="Purposes"
      value={product?.purposes.value.map(displayProductPurpose).join(', ')}
      loading={!product}
      wrap={(node) => <Grid item>{node}</Grid>}
    />

    <DisplayProperty
      label="Methodology"
      value={
        product?.methodology.value
          ? displayMethodologyWithLabel(product.methodology.value)
          : undefined
      }
      loading={!product}
      wrap={(node) => <Grid item>{node}</Grid>}
    />

    <DisplayProperty
      label="Scripture"
      value={
        product && product.scriptureReferences.value.length > 0 ? (
          <List disablePadding>
            {product.scriptureReferences.value.map((ref, i) => (
              <ListItem key={i} disableGutters>
                {ref.label}
              </ListItem>
            ))}
          </List>
        ) : null
      }
      loading={!product}
      wrap={(node) => <Grid item>{node}</Grid>}
    />
  </>
);

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loading={
        props.loading ? (
          <>
            <Typography variant="body2">
              <Skeleton width="10%" />
            </Typography>
            <Typography variant="body1">
              <Skeleton width="40%" />
            </Typography>
          </>
        ) : null
      }
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );
