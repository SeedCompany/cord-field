import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import {
  CreateProduct as CreateProductType,
  handleFormError,
} from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ButtonLink } from '../../../components/Routing';
import { ProductForm } from '../ProductForm';
import {
  useCreateProductMutation,
  useGetProductBreadcrumbQuery,
} from './CreateProduct.generated';

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

export const CreateProduct = () => {
  const classes = useStyles();

  const { projectId, engagementId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data } = useGetProductBreadcrumbQuery({
    variables: {
      projectId,
      engagementId,
    },
  });

  const project = data?.project;

  const [createProduct] = useCreateProductMutation();

  return (
    <main className={classes.root}>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <Breadcrumb to={`/projects/${projectId}/engagements/${engagementId}`}>
          {data?.engagement.__typename === 'LanguageEngagement' &&
            data.engagement.language.value?.name.value}
        </Breadcrumb>
        <Typography variant="h4">Create Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">Create Product</Typography>
      <ProductForm<CreateProductType>
        onSubmit={async ({
          productType,
          books,
          produces,
          scriptureReferences,
          ...inputs
        }) => {
          const isDerivativeProduct =
            productType &&
            ['story', 'film', 'song', 'literacyMaterial'].includes(productType);

          const inputWithProduces =
            isDerivativeProduct && produces
              ? {
                  produces,
                  scriptureReferencesOverride: scriptureReferences,
                  ...inputs,
                }
              : {
                  ...inputs,
                  scriptureReferences,
                };

          try {
            const { data } = await createProduct({
              variables: {
                input: {
                  product: inputWithProduces,
                },
              },
            });

            const { product } = data!.createProduct;

            enqueueSnackbar(`Created Product: ${product.id}`, {
              variant: 'success',
              action: () => (
                <ButtonLink
                  color="inherit"
                  to={`/projects/${projectId}/engagements/${engagementId}/products/${product.id}`}
                >
                  Edit
                </ButtonLink>
              ),
            });
          } catch (e) {
            await handleFormError(e);
          }
        }}
        initialValues={{ engagementId }}
      />
    </main>
  );
};
