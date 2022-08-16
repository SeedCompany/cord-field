import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import {
  ProductMedium,
  ProductMediumLabels,
  ProductStepLabels,
} from '~/api/schema.graphql';
import { displayMethodologyWithLabel, mapFromList } from '~/common';
import {
  ChangesetPropertyBadge,
  ChangesetPropList,
} from '~/components/Changeset';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Link } from '../../../components/Routing';
import { ProductDetailFragment as Product } from './ProductDetail.graphql';

const useStyles = makeStyles()(() => ({
  listItem: {
    margin: 0,
  },
  completionDescription: {
    overflowWrap: 'break-word',
  },
}));

export const ProductInfo = ({ product }: { product?: Product }) => {
  const { classes } = useStyles();
  const ppm = mapFromList(
    product?.engagement.partnershipsProducingMediums.items ?? [],
    (pair) => [pair.medium, pair.partnership]
  );
  return (
    <>
      {product?.__typename === 'OtherProduct' && (
        <DisplayProperty
          label="Description"
          value={product.description.value}
          loading={!product}
          wrap={infoWrapper}
          propValueWrap={(value) => (
            <ChangesetPropertyBadge
              iconHorizontalOrigin="right"
              current={product}
              prop="description"
            >
              {value}
            </ChangesetPropertyBadge>
          )}
        />
      )}

      <DisplayProperty
        label="Distribution Methods"
        value={
          product && product.mediums.value.length > 0 ? (
            <ChangesetPropList
              current={product}
              prop="mediums"
              renderListItem={(medium: ProductMedium) => (
                <ListItemText
                  primary={ProductMediumLabels[medium]}
                  secondary={
                    ppm[medium]?.partner.value?.organization.value?.name
                      .value ? (
                      <>
                        <Typography variant="caption" color="inherit">
                          &nbsp;via&nbsp;
                        </Typography>
                        <Link
                          to={`/partners/${ppm[medium]!.partner.value!.id}`}
                        >
                          {
                            ppm[medium]!.partner.value!.organization.value!.name
                              .value
                          }
                        </Link>
                      </>
                    ) : undefined
                  }
                  className={classes.listItem}
                />
              )}
            />
          ) : null
        }
        loading={!product}
        wrap={infoWrapper}
      />

      <DisplayProperty
        label="Methodology"
        value={
          product?.methodology.value
            ? displayMethodologyWithLabel(product.methodology.value)
            : undefined
        }
        loading={!product}
        wrap={infoWrapper}
        propValueWrap={(value) => (
          <ChangesetPropertyBadge
            iconHorizontalOrigin="right"
            current={product}
            prop="methodology"
          >
            {value}
          </ChangesetPropertyBadge>
        )}
      />

      <DisplayProperty
        label="Completion Description"
        value={product?.describeCompletion.value}
        loading={!product}
        wrap={infoWrapper}
        className={classes.completionDescription}
        propValueWrap={(value) => (
          <ChangesetPropertyBadge
            iconHorizontalOrigin="right"
            current={product}
            prop="describeCompletion"
          >
            {value}
          </ChangesetPropertyBadge>
        )}
      />

      <DisplayProperty
        label="Scripture"
        value={
          product && product.scriptureReferences.value.length > 0 ? (
            <ChangesetPropList
              current={product}
              prop="scriptureReferences"
              listItemKey="label"
              renderListItem={(item) => item.label}
            />
          ) : null
        }
        loading={!product}
        wrap={infoWrapper}
      />

      {!product?.progressOfCurrentReportDue && (
        <DisplayProperty
          label="Steps"
          value={
            product && product.steps.value.length > 0 ? (
              <List disablePadding>
                {product.steps.value.map((step) => (
                  <ListItem key={step} disableGutters>
                    <ListItemText
                      primary={ProductStepLabels[step]}
                      className={classes.listItem}
                    />
                  </ListItem>
                ))}
              </List>
            ) : null
          }
          loading={!product}
          wrap={infoWrapper}
        />
      )}
    </>
  );
};

const infoWrapper = (node: ReactNode) => (
  <Grid item md={12}>
    {node}
  </Grid>
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
