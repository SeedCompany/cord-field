import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { addItemToList, handleFormError } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ButtonLink } from '../../../components/Routing';
import { parsedRangesWithFullTestamentRange } from '../../../util/biblejs';
import { ProductForm } from '../ProductForm';
import {
  CreateProductDocument,
  GetProductBreadcrumbDocument,
} from './CreateProduct.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

export const CreateProduct = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { projectId, engagementId = '' } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useQuery(GetProductBreadcrumbDocument, {
    variables: {
      projectId,
      engagementId,
    },
  });

  const project = data?.project;
  const engagement = data?.engagement;

  const [createProduct] = useMutation(CreateProductDocument, {
    update: addItemToList({
      listId: [
        // Need to narrow type to language engagement to get the product list on that concrete
        engagement?.__typename === 'LanguageEngagement'
          ? engagement
          : undefined,
        'products',
      ],
      outputToItem: (res) => res.createProduct.product,
    }),
  });

  return (
    <main className={classes.root}>
      <Helmet title="Create Product" />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} projectId={projectId} />
        <Typography variant="h4">Create Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Create Product'}
      </Typography>
      {!loading && (
        <ProductForm
          onSubmit={async (
            {
              product: {
                productType,
                produces,
                scriptureReferences,
                fullOldTestament,
                fullNewTestament,
                ...inputs
              },
            },
            form
          ) => {
            const parsedScriptureReferences = parsedRangesWithFullTestamentRange(
              scriptureReferences,
              fullOldTestament,
              fullNewTestament
            );
            try {
              const { data } = await createProduct({
                variables: {
                  input: {
                    product: {
                      engagementId,
                      ...inputs,
                      ...(productType !== 'DirectScriptureProduct' && produces
                        ? {
                            produces: produces.id,
                            scriptureReferencesOverride: parsedScriptureReferences,
                          }
                        : {
                            scriptureReferences: parsedScriptureReferences,
                          }),
                    },
                  },
                },
              });

              const { product } = data!.createProduct;

              enqueueSnackbar(`Created product`, {
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
              return await handleFormError(e, form);
            }
          }}
        />
      )}
    </main>
  );
};
