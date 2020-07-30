import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import { UpdateProduct } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ProductForm } from '../ProductForm';
import {
  useProductQuery,
  useUpdateProductMutation,
} from './EditProduct.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'scroll',
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

  const { data } = useProductQuery({
    variables: {
      projectId,
      engagementId,
      productId,
    },
  });

  const project = data?.project;
  const product = data?.product;

  const initialValues = {
    engagementId,
    id: product?.id,
    scriptureReferences: product?.scriptureReferences.value,
    mediums: product?.mediums.value,
    purposes: product?.purposes.value,
    methodology: product?.methodology.value,
  };

  const [createProduct] = useUpdateProductMutation();

  return (
    <main className={classes.root}>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <Breadcrumb to={`/projects/${projectId}/engagements/${engagementId}`}>
          {data?.engagement.__typename === 'LanguageEngagement' &&
            data.engagement.language.value?.name.value}
        </Breadcrumb>
        <Typography variant="h4">Edit Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">Edit Product</Typography>
      <ProductForm<UpdateProduct>
        onSubmit={async ({ productType, ...input }) => {
          //TODO: need to catch this error
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
        }}
        initialValues={initialValues}
      />
    </main>
  );
};
