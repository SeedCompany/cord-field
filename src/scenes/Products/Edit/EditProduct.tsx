import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { handleFormError } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  fullNewTestamentRange,
  fullOldTestamentRange,
  parsedRangesWithFullTestamentRange,
} from '../../../util/biblejs';
import { ProductForm } from '../ProductForm';
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

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
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

  const [updateProduct] = useUpdateProductMutation();

  const project = data?.project;
  const engagement = data?.engagement;
  const product = data?.product;

  const initialValues = useMemo(() => {
    if (!product) return undefined;
    const { mediums, purposes, methodology, scriptureReferences } = product;

    const scriptureReferencesWithoutTypename = removeScriptureTypename(
      scriptureReferences.value
    );

    const referencesWithoutFullTestament = scriptureReferencesWithoutTypename.filter(
      (reference) =>
        !isEqual(reference, fullOldTestamentRange) &&
        !isEqual(reference, fullNewTestamentRange)
    );

    return {
      product: {
        mediums: mediums.value,
        purposes: purposes.value,
        methodology: methodology.value,
        scriptureReferences: referencesWithoutFullTestament,
        fullOldTestament: scriptureReferencesWithoutTypename.some((reference) =>
          isEqual(reference, fullOldTestamentRange)
        ),
        fullNewTestament: scriptureReferencesWithoutTypename.some((reference) =>
          isEqual(reference, fullNewTestamentRange)
        ),
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
      },
    };
  }, [product]);

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

      {product && (
        <ProductForm
          product={product}
          onSubmit={async ({
            product: {
              productType,
              produces,
              scriptureReferences,
              fullOldTestament,
              fullNewTestament,
              ...input
            },
          }) => {
            try {
              const parsedScriptureReferences = parsedRangesWithFullTestamentRange(
                scriptureReferences,
                fullOldTestament,
                fullNewTestament
              );

              await updateProduct({
                variables: {
                  input: {
                    product: {
                      id: product.id,
                      ...input,
                      produces: produces?.id,
                      ...(productType !== 'DirectScriptureProduct'
                        ? {
                            scriptureReferencesOverride: parsedScriptureReferences,
                          }
                        : {
                            scriptureReferences: parsedScriptureReferences,
                          }),
                    },
                  },
                },
              });

              enqueueSnackbar(`Updated product`, {
                variant: 'success',
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
