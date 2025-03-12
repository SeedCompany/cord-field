import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import { entries, mapEntries } from '@seedcompany/common';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { addItemToList, handleFormError } from '~/api';
import { callAll, getFullBookRange } from '~/common';
import { useChangesetAwareIdFromUrl } from '../../../components/Changeset';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import {
  ProductForm,
  ProductFormProps,
  ProductFormValues,
} from '../ProductForm';
import { UpdatePartnershipsProducingMediumsDocument } from '../ProductForm/PartnershipsProducingMediums.graphql';
import { addProductProgress } from './addProductProgress';
import {
  CreateDerivativeScriptureProductDocument as CreateDerivativeScriptureProduct,
  CreateDirectScriptureProductDocument as CreateDirectScriptureProduct,
  CreateOtherProductDocument as CreateOtherProduct,
  CreateDirectScriptureProductMutation as CreateProductMutation,
  ProductInfoForCreateDocument,
} from './CreateProduct.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

export const CreateProduct = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { id: engagementId, changesetId } =
    useChangesetAwareIdFromUrl('engagementId');

  const { data, loading } = useQuery(ProductInfoForCreateDocument, {
    variables: {
      engagementId,
      changeset: changesetId,
    },
  });

  const engagement =
    // Products are only created for language engagements
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement
      : undefined;

  const updateCacheForNewProduct = callAll(
    addProductProgress(engagement!),
    addItemToList({
      listId: [engagement, 'products'],
      outputToItem: (res: CreateProductMutation) => res.createProduct.product,
    })
  );
  const [createDirectScriptureProduct] = useMutation(
    CreateDirectScriptureProduct,
    {
      update: updateCacheForNewProduct,
    }
  );
  const [createDerivativeScriptureProduct] = useMutation(
    CreateDerivativeScriptureProduct,
    {
      update: updateCacheForNewProduct,
    }
  );
  const [createOtherProduct] = useMutation(CreateOtherProduct, {
    update: updateCacheForNewProduct,
  });
  const [updatePartnershipsProducingMediums] = useMutation(
    UpdatePartnershipsProducingMediumsDocument
  );

  const initialValues = useMemo(() => {
    const values: ProductFormValues = {
      product: {
        title: '',
        bookSelection: 'full',
        producingMediums: mapEntries(
          engagement?.partnershipsProducingMediums.items ?? [],
          (pair) => [pair.medium, pair.partnership ?? undefined]
        ).asRecord,
      },
    };
    return values;
  }, [engagement]);

  const handleSubmit: ProductFormProps['onSubmit'] = async (
    submitted,
    form
  ) => {
    const { dirtyFields } = form.getState();

    const createProduct = async () => {
      const {
        productType,
        producesId,
        scriptureReferences,
        unspecifiedScripture,
        book,
        bookSelection,
        title,
        description,
        producingMediums,
        ...inputs
      } = submitted.product ?? {};

      const parsedScriptureReferences =
        bookSelection === 'full' && book
          ? [getFullBookRange(book)]
          : scriptureReferences ?? [];

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
        return data!.createProduct.product;
      } else if (productType === 'DirectScriptureProduct') {
        const { data } = await createDirectScriptureProduct({
          variables: {
            input: {
              engagementId,
              scriptureReferences: parsedScriptureReferences,
              unspecifiedScripture:
                parsedScriptureReferences.length > 0 ||
                !unspecifiedScripture?.totalVerses ||
                !book
                  ? null
                  : {
                      book,
                      ...unspecifiedScripture,
                    },
              ...inputs,
            },
          },
        });
        return data!.createProduct.product;
      } else {
        const { data } = await createDerivativeScriptureProduct({
          variables: {
            input: {
              engagementId,
              ...inputs,
              produces: producesId!.id,
              scriptureReferencesOverride: parsedScriptureReferences,
            },
          },
        });
        return data!.createProduct.product;
      }
    };
    const updatePpm = async () => {
      if (
        !engagement ||
        !Object.keys(dirtyFields).some((field) =>
          field.startsWith('product.producingMediums.')
        )
      ) {
        // No producing partnerships have changed, API call not needed.
        return;
      }

      const ppmInput = entries(submitted.product?.producingMediums ?? {}).map(
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

    try {
      await Promise.all([createProduct(), updatePpm()]);

      navigate(`/engagements/${engagementId}`);
    } catch (e) {
      return await handleFormError(e, form);
    }
  };

  return (
    <main className={classes.root}>
      <Helmet title="Create Goal" />
      <Breadcrumbs>
        <ProjectBreadcrumb data={engagement?.project} />
        <EngagementBreadcrumb data={engagement} />
        <Typography variant="h4">Create Goal</Typography>
      </Breadcrumbs>
      <Typography variant="h2">
        {loading ? <Skeleton width="50%" variant="text" /> : 'Create Goal'}
      </Typography>
      {!loading &&
        data &&
        data.engagement.__typename === 'LanguageEngagement' && (
          <ProductForm
            engagement={data.engagement}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        )}
    </main>
  );
};
