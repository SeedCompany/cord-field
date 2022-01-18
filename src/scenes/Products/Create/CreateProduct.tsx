import { useMutation, useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { addItemToList, handleFormError } from '../../../api';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { entries, mapFromList } from '../../../util';
import { getFullBookRange } from '../../../util/biblejs';
import { useProjectId } from '../../Projects/useProjectId';
import {
  ProductForm,
  ProductFormProps,
  ProductFormValues,
} from '../ProductForm';
import { UpdatePartnershipsProducingMediumsDocument } from '../ProductForm/PartnershipsProducingMediums.generated';
import {
  CreateDerivativeScriptureDocument,
  CreateDirectScriptureProductDocument,
  CreateOtherProductDocument,
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

  const { projectId, changesetId } = useProjectId();
  const { engagementId = '' } = useParams();

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

  const [createDirectScriptureProduct] = useMutation(
    CreateDirectScriptureProductDocument,
    {
      update: addItemToList({
        listId: [engagement, 'products'],
        outputToItem: (res) => res.createDirectScriptureProduct.product,
      }),
    }
  );
  const [createDerivativeScriptureProduct] = useMutation(
    CreateDerivativeScriptureDocument,
    {
      update: addItemToList({
        listId: [engagement, 'products'],
        outputToItem: (res) => res.createDerivativeScriptureProduct.product,
      }),
    }
  );
  const [createOtherProduct] = useMutation(CreateOtherProductDocument, {
    update: addItemToList({
      listId: [engagement, 'products'],
      outputToItem: (res) => res.createOtherProduct.product,
    }),
  });
  const [updatePartnershipsProducingMediums] = useMutation(
    UpdatePartnershipsProducingMediumsDocument
  );

  const initialValues = useMemo(() => {
    const values: ProductFormValues = {
      product: {
        title: '',
        bookSelection: 'full',
        producingMediums: mapFromList(
          engagement?.partnershipsProducingMediums.items ?? [],
          (pair) => [pair.medium, pair.partnership ?? undefined]
        ),
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
        produces,
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
        return data!.createOtherProduct.product;
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
        return data!.createDirectScriptureProduct.product;
      } else {
        const { data } = await createDerivativeScriptureProduct({
          variables: {
            input: {
              engagementId,
              ...inputs,
              produces: produces!.id,
              scriptureReferencesOverride: parsedScriptureReferences,
            },
          },
        });
        return data!.createDerivativeScriptureProduct.product;
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

      navigate('../../');
    } catch (e) {
      return await handleFormError(e, form);
    }
  };

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
