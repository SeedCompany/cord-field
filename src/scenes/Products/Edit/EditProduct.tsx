import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import {
  handleFormError,
  LanguageEngagement,
  removeItemFromList,
} from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  fullNewTestamentRange,
  fullOldTestamentRange,
  parsedRangesWithFullTestamentRange,
  removeScriptureTypename,
} from '../../../util/biblejs';
import { useProjectId } from '../../Projects/useProjectId';
import { ProductForm, ProductFormProps } from '../ProductForm';
import { ProductFormValues } from '../ProductForm/AccordionSection';
import { UpdateProductProgressDocument } from '../ProductForm/ProductProgress.generated';
import {
  DeleteProductDocument,
  ProductInfoForEditDocument,
  UpdateProductDocument,
} from './EditProduct.generated';

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

  const { projectId, changesetId } = useProjectId();
  const { engagementId = '', productId = '' } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useQuery(ProductInfoForEditDocument, {
    variables: {
      projectId,
      changeset: changesetId,
      engagementId,
      productId,
    },
  });

  const project = data?.project;
  const engagement = data?.engagement;
  const product = data?.product;

  const [updateProduct] = useMutation(UpdateProductDocument);
  const [deleteProduct] = useMutation(DeleteProductDocument, {
    update: removeItemFromList({
      listId: [engagement as LanguageEngagement, 'products'],
      item: product!,
    }),
  });
  const [updateProductProgress] = useMutation(UpdateProductProgressDocument);

  const initialValues = useMemo(() => {
    if (!product) return undefined;
    const { mediums, purposes, methodology, scriptureReferences } = product;

    const scriptureReferencesWithoutTypename = removeScriptureTypename(
      scriptureReferences.value
    );

    const referencesWithoutFullTestament =
      scriptureReferencesWithoutTypename.filter(
        (reference) =>
          !isEqual(reference, fullOldTestamentRange) &&
          !isEqual(reference, fullNewTestamentRange)
      );

    const values: ProductFormValues = {
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
        stepNames: product.progressOfCurrentReportDue?.steps.map(
          ({ step }) => step
        ),
        productSteps: product.progressOfCurrentReportDue?.steps.map((step) => ({
          step: step.step,
          percentDone: step.percentDone,
        })),
      },
    };
    return values;
  }, [product]);

  const handleSubmit: ProductFormProps['onSubmit'] = async (data) => {
    if (!product) {
      return;
    }

    if (data.submitAction === 'delete') {
      await deleteProduct({
        variables: {
          productId: product.id,
        },
      });

      enqueueSnackbar(`Deleted product`, {
        variant: 'success',
      });
    } else {
      const {
        productType,
        produces,
        scriptureReferences,
        fullOldTestament,
        fullNewTestament,
        productSteps,
        stepNames,
        ...input
      } = data.product;

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

      const reportId = product.progressOfCurrentReportDue?.report.id;
      if (reportId) {
        await updateProductProgress({
          variables: {
            input: {
              steps:
                productSteps?.filter((s) => stepNames?.includes(s.step)) || [],
              productId: product.id,
              reportId,
            },
          },
        });
      }

      enqueueSnackbar(`Updated product`, {
        variant: 'success',
      });
    }

    navigate('../../');
  };

  return (
    <main className={classes.root}>
      {/* TODO label product */}
      <Helmet title="Edit Product" />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} />
        <Typography variant="h4">Edit Product</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Edit Product'}
      </Typography>

      {!loading && data && product && (
        <ProductForm
          methodologyAvailableSteps={data.methodologyAvailableSteps}
          product={product}
          productSteps={product.progressOfCurrentReportDue?.steps}
          onSubmit={async (data, form) => {
            try {
              await handleSubmit(data, form);
            } catch (e) {
              return await handleFormError(e, form);
            }
          }}
          initialValues={initialValues}
        />
      )}
    </main>
  );
};
