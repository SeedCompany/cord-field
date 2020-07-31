import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
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
    overflowY: 'auto',
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

  const { data, loading } = useGetProductBreadcrumbQuery({
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
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Create Product'}
      </Typography>
      {!loading && (
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
              ['Story', 'Film', 'Song', 'LiteracyMaterial'].includes(
                productType
              );

            try {
              const { data } = await createProduct({
                variables: {
                  input: {
                    product: {
                      ...inputs,
                      ...(isDerivativeProduct && produces
                        ? {
                            produces,
                            scriptureReferencesOverride: scriptureReferences,
                          }
                        : {
                            scriptureReferences,
                          }),
                    },
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
      )}
    </main>
  );
};
