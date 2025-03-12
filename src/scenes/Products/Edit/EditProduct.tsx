import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import { entries, mapEntries } from '@seedcompany/common';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import {
  callAll,
  getFullBookRange,
  isFullBookRange,
  removeScriptureTypename,
} from '~/common';
import { handleFormError, removeItemFromList } from '../../../api';
import { useChangesetAwareIdFromUrl } from '../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  ProductForm,
  ProductFormProps,
  ProductFormValues,
} from '../ProductForm';
import { UpdatePartnershipsProducingMediumsDocument } from '../ProductForm/PartnershipsProducingMediums.graphql';
import { ProductLoadError } from '../ProductLoadError';
import {
  DeleteProductDocument,
  ProductInfoForEditDocument,
  UpdateDerivativeScriptureProductDocument,
  UpdateDirectScriptureProductDocument,
  UpdateOtherProductDocument,
} from './EditProduct.graphql';
import {
  deleteProductProgress,
  updateProgressSteps,
} from './updateProgressSteps';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

export const EditProduct = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { id, changesetId } = useChangesetAwareIdFromUrl('productId');
  const { data, loading, error } = useQuery(ProductInfoForEditDocument, {
    variables: {
      id,
      changesetId,
    },
  });

  const product = data?.product;
  const engagement = product?.engagement;
  const project = engagement?.project;

  const onUpdate = updateProgressSteps(engagement!, product!);
  const [updateDirectScriptureProduct] = useMutation(
    UpdateDirectScriptureProductDocument,
    { update: onUpdate }
  );
  const [updateDerivativeScriptureProduct] = useMutation(
    UpdateDerivativeScriptureProductDocument,
    { update: onUpdate }
  );
  const [updateOtherProduct] = useMutation(UpdateOtherProductDocument, {
    update: onUpdate,
  });

  const [deleteProduct] = useMutation(DeleteProductDocument, {
    update: callAll(
      removeItemFromList({
        listId: [engagement, 'products'],
        item: product!,
      }),
      deleteProductProgress(engagement!, product!)
    ),
  });
  const [updatePartnershipsProducingMediums] = useMutation(
    UpdatePartnershipsProducingMediumsDocument
  );

  const initialValues = useMemo(() => {
    if (!product) return undefined;
    const { mediums, methodology, progressStepMeasurement, progressTarget } =
      product;

    const scriptureReferences = removeScriptureTypename(
      product.scriptureReferences.value
    );

    const unspecifiedScripture =
      product.__typename === 'DirectScriptureProduct'
        ? product.unspecifiedScripture.value
        : null;

    const book =
      (product.__typename === 'DirectScriptureProduct'
        ? product.unspecifiedScripture.value?.book
        : undefined) ?? scriptureReferences[0]?.start.book;

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
              product.produces.value?.__typename === 'Story' ||
              product.produces.value?.__typename === 'EthnoArt')
          ? {
              producesId: {
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
        producingMediums: mapEntries(
          engagement?.partnershipsProducingMediums.items ?? [],
          (pair) => [pair.medium, pair.partnership ?? undefined]
        ).asRecord,
      },
    };
    return values;
  }, [product, engagement]);

  const handleSubmit: ProductFormProps['onSubmit'] = async (data, form) => {
    if (!product || !engagement) {
      return;
    }

    if (data.submitAction === 'delete') {
      await deleteProduct({
        variables: {
          productId: product.id,
        },
      });

      navigate(`/engagements/${engagement.id}`);
      return;
    }
    const { dirtyFields } = form.getState();

    const updateProduct = async () => {
      if (
        Object.keys(dirtyFields).filter(
          (field) => !field.startsWith('product.producingMediums.')
        ).length === 0
      ) {
        // Changes have not been made that affect the product.
        return;
      }

      const {
        productType,
        producesId,
        scriptureReferences,
        book,
        title,
        description,
        bookSelection,
        unspecifiedScripture,
        producingMediums,
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
              produces: producesId!.id,
              scriptureReferencesOverride: parsedScriptureReferences,
            },
          },
        });
      }
    };

    const updatePpm = async () => {
      if (
        !Object.keys(dirtyFields).some((field) =>
          field.startsWith('product.producingMediums.')
        )
      ) {
        // No producing partnerships have changed, API call not needed.
        return;
      }

      const ppmInput = entries(data.product?.producingMediums ?? {}).map(
        ([medium, partnership]) => ({
          medium: medium,
          partnership: partnership?.id,
        })
      );
      await updatePartnershipsProducingMediums({
        variables: {
          engagementId: engagement.id,
          input: ppmInput,
        },
      });
    };

    await Promise.all([updateProduct(), updatePpm()]);

    navigate('../');
  };

  if (error) {
    return <ProductLoadError error={error} />;
  }

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

      {!loading && data && (
        <ProductForm
          product={data.product}
          engagement={data.product.engagement}
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
