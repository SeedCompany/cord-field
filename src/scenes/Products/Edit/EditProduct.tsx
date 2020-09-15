import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Except } from 'type-fest';
import { handleFormError, UpdateProduct } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProductForm, ProductFormCustomValues } from '../ProductForm';
import { ScriptureRangeFragment } from '../ProductForm/ProductForm.generated';
import {
  useProductQuery,
  useUpdateProductMutation,
} from './EditProduct.generated';

const removeScriptureTypename = (
  scriptureReferences: readonly ScriptureRangeFragment[]
) =>
  scriptureReferences.map(
    ({ start: { __typename, ...start }, end: { __typename: _, ...end } }) => ({
      start,
      end,
    })
  );

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

export const EditProduct = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { projectId, engagementId, productId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useProductQuery({
    variables: {
      projectId,
      engagementId,
      productId,
    },
  });

  const project = data?.project;
  const engagement = data?.engagement;

  const renderProductForm = () => {
    if (!data) return null;
    const { product } = data;
    const { id, mediums, purposes, methodology } = product;

    const initialValues = {
      id,
      mediums: mediums.value,
      purposes: purposes.value,
      methodology: methodology.value,
      scriptureReferences: removeScriptureTypename(
        product.scriptureReferences.value
      ),
      //TODO: make sure these are shown when response is ready
      ...(product.__typename === 'DirectScriptureProduct'
        ? {
            productType: product.__typename,
          }
        : product.__typename === 'DerivativeScriptureProduct' &&
          (product.produces.value?.__typename === 'Film' ||
            product.produces.value?.__typename === 'Song' ||
            product.produces.value?.__typename === 'LiteracyMaterial' ||
            product.produces.value?.__typename === 'Story')
        ? {
            produces: {
              id: product.produces.value.id,
              name: product.produces.value.name,
            },
            productType: product.produces.value.__typename,
          }
        : undefined),
    };
    return (
      <ProductForm<
        ProductFormCustomValues & {
          product: Except<UpdateProduct, 'produces'>;
        }
      >
        product={product}
        onSubmit={async ({
          product: { productType, book, produces, ...input },
        }) => {
          try {
            await createProduct({
              variables: {
                input: {
                  product: { ...input, produces: produces?.id },
                },
              },
            });

            enqueueSnackbar(`Updates Saved`, {
              variant: 'success',
            });

            navigate('../../');
          } catch (e) {
            await handleFormError(e);
          }
        }}
        initialValues={{ product: initialValues }}
      />
    );
  };

  const [createProduct] = useUpdateProductMutation();

  return (
    <main className={classes.root}>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} projectId={projectId} />
        <Typography variant="h4">Edit Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Edit Product'}
      </Typography>
      {renderProductForm()}
    </main>
  );
};
