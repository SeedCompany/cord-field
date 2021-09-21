import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { addItemToList, handleFormError, Product } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ButtonLink } from '../../../components/Routing';
import { parsedRangesWithFullTestamentRange } from '../../../util/biblejs';
import { useProjectId } from '../../Projects/useProjectId';
import { ProductForm } from '../ProductForm';
import {
  CreateOtherProductDocument,
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
  const [createOtherProduct] = useMutation(CreateOtherProductDocument, {
    update: addItemToList({
      listId: [engagement, 'products'],
      outputToItem: (res) => res.createOtherProduct.product,
    }),
  });

  return (
    <main className={classes.root}>
      <Helmet title="Create Goal" />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} />
        <Typography variant="h4">Create Goal</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Create Goal'}
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
              title,
              description,
              ...inputs
            } = submitted.product ?? {};

            const parsedScriptureReferences =
              parsedRangesWithFullTestamentRange(
                scriptureReferences,
                fullOldTestament,
                fullNewTestament
              );
            try {
              let product: Product;
              if (productType === 'Other') {
                const { data } = await createOtherProduct({
                  variables: {
                    input: {
                      engagementId,
                      title: title || '',
                      description,
                      ...inputs,
                    },
                  },
                });
                product = data?.createOtherProduct.product as Product;
              } else {
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
                product = data?.createProduct.product as Product;
              }

              enqueueSnackbar(`Created goal`, {
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
