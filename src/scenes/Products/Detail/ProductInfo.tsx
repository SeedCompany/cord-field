import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { mapEntries } from '@seedcompany/common';
import { ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ProductMediumLabels, ProductStepLabels } from '~/api/schema.graphql';
import { displayMethodologyWithLabel } from '~/common';
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
  const ppm = mapEntries(
    product?.engagement.partnershipsProducingMediums.items ?? [],
    (pair) => [pair.medium, pair.partnership]
  ).asRecord;
  return (
    <>
      {product?.__typename === 'OtherProduct' && (
        <DisplayProperty
          label="Description"
          value={product.description.value}
          loading={!product}
          wrap={infoWrapper}
        />
      )}

      <DisplayProperty
        label="Distribution Methods"
        value={
          product && product.mediums.value.length > 0 ? (
            <List disablePadding>
              {product.mediums.value.map((medium) => (
                <ListItem key={medium} disableGutters>
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
                              ppm[medium]!.partner.value!.organization.value!
                                .name.value
                            }
                          </Link>
                        </>
                      ) : undefined
                    }
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

      <DisplayProperty
        label="Methodology"
        value={
          product?.methodology.value
            ? displayMethodologyWithLabel(product.methodology.value)
            : undefined
        }
        loading={!product}
        wrap={infoWrapper}
      />

      <DisplayProperty
        label="Completion Description"
        value={product?.describeCompletion.value}
        loading={!product}
        wrap={infoWrapper}
        className={classes.completionDescription}
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
