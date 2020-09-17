import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CreateProductInput, handleFormError } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ButtonLink } from '../../../components/Routing';
import { ProductForm, ProductFormCustomValues } from '../ProductForm';
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
  const navigate = useNavigate();

  const { projectId, engagementId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useGetProductBreadcrumbQuery({
    variables: {
      projectId,
      engagementId,
    },
  });

  const project = data?.project;
  const engagement = data?.engagement;

  const [createProduct] = useCreateProductMutation();

  const initialValues = useMemo(() => ({ product: { engagementId } }), [
    engagementId,
  ]);

  return (
    <main className={classes.root}>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} projectId={projectId} />
        <Typography variant="h4">Create Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Create Product'}
      </Typography>
      {!loading && (
        <ProductForm<CreateProductInput & ProductFormCustomValues>
          onSubmit={async ({
            product: { productType, produces, scriptureReferences, ...inputs },
          }) => {
            try {
              const { data } = await createProduct({
                variables: {
                  input: {
                    product: {
                      ...inputs,
                      ...(productType !== 'DirectScriptureProduct' && produces
                        ? {
                            produces: produces.id,
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

              //TODO: confirm with design what to show here
              enqueueSnackbar(`Created ${product.__typename}`, {
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

              navigate('../../');
            } catch (e) {
              await handleFormError(e);
            }
          }}
          initialValues={initialValues}
        />
      )}
    </main>
  );
};
