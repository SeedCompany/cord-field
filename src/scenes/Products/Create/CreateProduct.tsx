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
import { useProjectId } from '../../Projects/useProjectId';
import { ProductForm } from '../ProductForm';
import {
  CreateProductDocument,
  ProductInfoForCreateDocument,
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

  const { projectId, changesetId, projectUrl } = useProjectId();
  const { engagementId = '' } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useQuery(ProductInfoForCreateDocument, {
    variables: {
      projectId,
      changeset: changesetId,
      engagementId,
    },
  });

  const project = data?.project;
  const engagement =
    // Products are only created for language engagements
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement
      : undefined;

  const [createProduct] = useMutation(CreateProductDocument, {
    update: addItemToList({
      listId: [engagement, 'products'],
      outputToItem: (res) => res.createProduct.product,
    }),
  });

  return (
    <main className={classes.root}>
      <Helmet title="Create Product" />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} />
        <Typography variant="h4">Create Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Create Product'}
      </Typography>
      {!loading && data && (
        <ProductForm
          onSubmit={async (submitted, form) => {
            const {
              productType,
              produces,
              scriptureReferences,
              fullOldTestament,
              fullNewTestament,
              ...inputs
            } = submitted.product ?? {};

            const parsedScriptureReferences =
              parsedRangesWithFullTestamentRange(
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
                            scriptureReferencesOverride:
                              parsedScriptureReferences,
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
                    to={`${projectUrl}/engagements/${engagementId}/products/${product.id}`}
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
