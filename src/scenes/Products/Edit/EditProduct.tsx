import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import { handleFormError, UpdateProductInput } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProductForm, ProductFormCustomValues } from '../ProductForm';
import { ProductForm_DirectScriptureProduct_Fragment } from '../ProductForm/ProductForm.generated';
import {
  useProductQuery,
  useUpdateProductMutation,
} from './EditProduct.generated';

const removeScriptureTypename = (
  scriptureReferenceArray?: ProductForm_DirectScriptureProduct_Fragment['scriptureReferences']['value']
) =>
  scriptureReferenceArray?.map(
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
    const { id, mediums, purposes, methodology, scriptureReferences } = product;

    const initialValues = {
      id,
      mediums: mediums.value,
      purposes: purposes.value,
      methodology: methodology.value,
      //TODO: make sure these are shown when response is ready
      ...(product.__typename === 'DirectScriptureProduct'
        ? {
            scriptureReferences: removeScriptureTypename(
              scriptureReferences.value
            ),
          }
        : product.__typename === 'DerivativeScriptureProduct'
        ? {
            scriptureReferences: removeScriptureTypename(
              product.scriptureReferencesOverride?.value
            ),
            produces: product.produces.__typename,
          }
        : undefined),
    };
    return (
      <ProductForm<UpdateProductInput & ProductFormCustomValues>
        product={product}
        onSubmit={async ({ product: { productType, book, ...input } }) => {
          try {
            const { data } = await createProduct({
              variables: {
                input: {
                  product: input,
                },
              },
            });

            const { product } = data!.updateProduct;

            enqueueSnackbar(`Edited Product: ${product.id}`, {
              variant: 'success',
            });
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
