import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { FC } from 'react';
import { useParams } from 'react-router';
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

export const CreateProduct: FC = () => {
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
        <Breadcrumb to={`/projects/${projectId}/${engagementId}`}>
          {data?.engagement.__typename === 'LanguageEngagement' &&
            data.engagement.language.value?.name.value}
        </Breadcrumb>
        <Breadcrumb
          to={`/projects/${projectId}/${engagementId}/create-product`}
        >
          Create Product
        </Breadcrumb>
      </Breadcrumbs>
      <Typography variant="h2">Create Product</Typography>
      <ProductForm
        onSubmit={async ({
          productType,
          books,
          produces,
          methodology,
          scriptureReferences,
          ...inputs
        }: any) => {
          const isDerivativeProduct =
            productType?.[0] &&
            ['story', 'film', 'song', 'literacyMaterial'].includes(
              productType[0]
            );

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

          //TODO: remove this step once ToggleButtonsField saves single select values as strings
          const inputWithMethodology = methodology?.[0]
            ? { ...inputWithProduces, methodology: methodology[0] }
            : inputWithProduces;

          //TODO: need to catch this error
          const { data } = await createProduct({
            variables: {
              input: {
                product: inputWithMethodology,
              },
            },
          });

          const { product } = data!.createProduct;

          enqueueSnackbar(`Created Product: ${product.id}`, {
            variant: 'success',
            action: () => (
              <ButtonLink
                color="inherit"
                to={`/projects/${projectId}/${engagementId}/${product.id}/edit`}
              >
                Edit
              </ButtonLink>
            ),
          });
        }}
        initialValues={{ engagementId }}
      />
    </main>
  );
};
