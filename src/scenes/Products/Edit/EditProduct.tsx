import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
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
  getFullBookRange,
  isFullBookRange,
  removeScriptureTypename,
} from '../../../util/biblejs';
import { useProjectId } from '../../Projects/useProjectId';
import {
  ProductForm,
  ProductFormProps,
  ProductFormValues,
} from '../ProductForm';
import {
  DeleteProductDocument,
  ProductInfoForEditDocument,
  UpdateDerivativeScriptureProductDocument,
  UpdateDirectScriptureProductDocument,
  UpdateOtherProductDocument,
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

  const [updateDirectScriptureProduct] = useMutation(
    UpdateDirectScriptureProductDocument
  );
  const [updateDerivativeScriptureProduct] = useMutation(
    UpdateDerivativeScriptureProductDocument
  );
  const [updateOtherProduct] = useMutation(UpdateOtherProductDocument);
  const [deleteProduct] = useMutation(DeleteProductDocument, {
    update: removeItemFromList({
      listId: [engagement as LanguageEngagement, 'products'],
      item: product!,
    }),
  });

  const initialValues = useMemo(() => {
    if (!product) return undefined;
    const {
      mediums,
      purposes,
      methodology,
      progressStepMeasurement,
      progressTarget,
    } = product;

    const scriptureReferences = removeScriptureTypename(
      product.scriptureReferences.value
    );

    const unspecifiedScripture =
      product.__typename === 'DirectScriptureProduct'
        ? product.unspecifiedScripture.value
        : null;

    const book =
      product.__typename === 'DirectScriptureProduct'
        ? product.unspecifiedScripture.value?.book ||
          scriptureReferences[0]?.start.book
        : undefined;

    const versesOnly = !!(
      product.__typename === 'DirectScriptureProduct' &&
      product.unspecifiedScripture.value
    );
    const bookSelection = versesOnly
      ? 'partialUnknown'
      : scriptureReferences.length > 0 && book
      ? isFullBookRange(scriptureReferences[0], book)
        ? 'full'
        : 'partialKnown'
      : 'full';

    const values: ProductFormValues = {
      product: {
        mediums: mediums.value,
        purposes: purposes.value,
        methodology: methodology.value,
        steps: product.steps.value,
        describeCompletion: product.describeCompletion.value,
        scriptureReferences: scriptureReferences,
        book: book,
        bookSelection: bookSelection,
        progressStepMeasurement: progressStepMeasurement.value,
        progressTarget: progressTarget.value,
        unspecifiedScripture: unspecifiedScripture
          ? {
              totalVerses: unspecifiedScripture.totalVerses,
            }
          : undefined,
        title: '',
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
        ...(product.__typename === 'OtherProduct'
          ? {
              productType: 'Other',
              title: product.title.value || '',
              description: product.description.value || '',
            }
          : undefined),
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

      enqueueSnackbar(`Deleted goal`, {
        variant: 'success',
      });
      navigate('../../../');
      return;
    } else {
      const {
        productType,
        produces,
        scriptureReferences,
        book,
        title,
        description,
        bookSelection,
        unspecifiedScripture,
        ...input
      } = data.product ?? {};

      const parsedScriptureReferences =
        bookSelection === 'partialUnknown'
          ? []
          : bookSelection === 'full' && book
          ? [getFullBookRange(book)]
          : scriptureReferences;
      if (productType === 'Other') {
        await updateOtherProduct({
          variables: {
            input: {
              id: product.id,
              ...input,
              title,
              description,
            },
          },
        });
      } else if (productType === 'DirectScriptureProduct') {
        await updateDirectScriptureProduct({
          variables: {
            input: {
              id: product.id,
              ...input,
              scriptureReferences: parsedScriptureReferences,
              unspecifiedScripture:
                bookSelection !== 'partialUnknown' ||
                !book ||
                !unspecifiedScripture?.totalVerses
                  ? null
                  : {
                      book,
                      ...unspecifiedScripture,
                    },
            },
          },
        });
      } else {
        await updateDerivativeScriptureProduct({
          variables: {
            input: {
              id: product.id,
              ...input,
              produces: produces!.id,
              scriptureReferencesOverride: parsedScriptureReferences,
            },
          },
        });
      }

      enqueueSnackbar(`Updated goal`, {
        variant: 'success',
      });
    }

    navigate('../');
  };

  return (
    <main className={classes.root}>
      {/* TODO label goal */}
      <Helmet title="Edit Goal" />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <EngagementBreadcrumb data={engagement} />
        <Typography variant="h4">Edit Goal</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Edit Goal'}
      </Typography>

      {!loading && data && product && (
        <ProductForm
          product={product}
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
